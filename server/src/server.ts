import express from "express"
import path from "path";
import * as io from 'socket.io';
import * as http from 'http';


import { clearInterval } from 'timers'
// import * as WebSocket from 'ws'

// import * as sslify from 'express-sslify'
import getDrones from "./getDrones";
import { DronesPilotList } from "./types";

// const redis = require('@socket.io/redis-adapter')

const app = express()
const PORT = process.env.PORT || 3001

const server = http.createServer(app);

const redis = require('redis');
const Redis = require('@socket.io/redis-adapter');

const pubClient = redis.createClient();
const subClient = pubClient.duplicate();
const redisAdapter = new Redis({ pubClient, subClient });


const socketServer = new io.Server(server, {
    path: '/drones'
});

// const pubClient = new Redis.createClient({ host: 'localhost', port: 6379 });


// const socket = new WebSocket.Server({ port: 8080 });

let DRONE_PILOTS_DB: DronesPilotList = {
    drones: [],
};

socketServer.adapter(Redis.createAdapter(pubClient, subClient));


socketServer.on('connection', async (socket: io.Socket) => {
    console.log('connected');

    const drones = await getDrones(DRONE_PILOTS_DB);

    DRONE_PILOTS_DB = {
        drones: drones.drones
    }


    console.log({ drones });


    socket.emit('drones', JSON.stringify(drones.drones))

    socket.on('disconnect', () => {
        console.log('disconnected');

        // clearInterval(intervalId)
    });
});



// const refreshData = async (ws: WebSocket.WebSocket) => {
//     const drones = await getDrones(DRONE_PILOTS_DB);

//     DRONE_PILOTS_DB = {
//         drones: drones.drones
//     }

//     console.log({ drones })
//     ws.send(JSON.stringify(DRONE_PILOTS_DB.drones));
// }



// socket.on('connection', async (ws) => {
//     ws.on('message', (message) => {
//         console.log('received: %s', message);
//     });


//     const refreshEmitter = new EventEmitter();


//     let intervalId: NodeJS.Timer = setInterval(() => {
//         refreshEmitter.emit('refresh');
//     }, 5000);


//     refreshEmitter.on('refresh', () => {
//         refreshData(ws)
//     });

//     // ws.onopen = () => {
//     //     intervalId = setInterval(async () => {
//     //         const drones = await getDrones(DRONE_PILOTS_DB);

//     //         DRONE_PILOTS_DB = {
//     //             drones: drones.drones
//     //         }

//     //         console.log({ drones })
//     //         ws.send(JSON.stringify(DRONE_PILOTS_DB.drones));
//     //     }, 5_000);
//     // }

//     ws.onclose = () => {
//         console.log('CLOSED');

//         clearInterval(intervalId)
//     }
// })

// app.use(sslify.HTTPS({ trustProtoHeader: true }));

// app.use((req, res, next) => {
//     req.headers['x-forwarded-host'] = req.headers['host']
//     req.headers['host'] = 'bird-nest-finnan.herokuapp.com'

//     next()
// })

app.use(express.static(path.resolve(__dirname, "../../client/build")));

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
});

app.get('/drones', async (_, res) => {
    const combinedDrones = await getDrones(DRONE_PILOTS_DB)

    DRONE_PILOTS_DB = combinedDrones

    res.send(combinedDrones)
})


server.listen(PORT, () => {
    console.log(`server running in port ${PORT}`);
})
