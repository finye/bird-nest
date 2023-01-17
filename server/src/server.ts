import express from "express"
import path from "path";
import * as WebSocket from 'ws'

import { EventEmitter } from 'events'
// import * as sslify from 'express-sslify'
import getDrones from "./getDrones";
import { DronesPilotList } from "./types";

const app = express()
const PORT = process.env.PORT || 3001

const socket = new WebSocket.Server({ port: 8080 });

let DRONE_PILOTS_DB: DronesPilotList = {
    drones: [],
};




const refreshEmitter = new EventEmitter();


let intervalId: NodeJS.Timer = setInterval(() => {
    refreshEmitter.emit('refresh');
}, 5000);


const refreshData = async (ws: WebSocket.WebSocket) => {
    const drones = await getDrones(DRONE_PILOTS_DB);

    DRONE_PILOTS_DB = {
        drones: drones.drones
    }

    console.log({ drones })
    ws.send(JSON.stringify(DRONE_PILOTS_DB.drones));
}



socket.on('connection', async (ws) => {
    ws.on('message', (message) => {
        console.log('received: %s', message);
    });


    refreshEmitter.on('refresh', () => {
        refreshData(ws)
    });

    // ws.onopen = () => {
    //     intervalId = setInterval(async () => {
    //         const drones = await getDrones(DRONE_PILOTS_DB);

    //         DRONE_PILOTS_DB = {
    //             drones: drones.drones
    //         }

    //         console.log({ drones })
    //         ws.send(JSON.stringify(DRONE_PILOTS_DB.drones));
    //     }, 5_000);
    // }

    ws.onclose = () => {
        console.log('CLOSED');

        clearInterval(intervalId)
    }
})

// app.use(sslify.HTTPS({ trustProtoHeader: true }));

app.use((req, res, next) => {
    req.headers['x-forwarded-host'] = req.headers['host']
    req.headers['host'] = 'bird-nest-finnan.herokuapp.com'

    next()
})

app.use(express.static(path.resolve(__dirname, "../../client/build")));

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
});

app.get('/drones', async (_, res) => {
    const combinedDrones = await getDrones(DRONE_PILOTS_DB)

    DRONE_PILOTS_DB = combinedDrones

    res.send(combinedDrones)
})


app.listen(PORT, () => {
    console.log(`server running in port ${PORT}`);
})
