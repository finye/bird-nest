import express from "express"
import path from "path";
import * as WebSocket from 'ws'
// import * as sslify from 'express-sslify'
import getDrones from "./getDrones";
import { DronesPilotList } from "./types";

const app = express()
const PORT = process.env.PORT || 3001

const socket = new WebSocket.Server({ port: 8080 });

let DRONE_PILOTS_DB: DronesPilotList = {
    drones: [],
};

let intervalId

socket.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log('received: %s', message);
    });

    ws.onopen = () => {
        intervalId = setInterval(async () => {
            const drones = await getDrones(DRONE_PILOTS_DB);

            DRONE_PILOTS_DB = {
                drones: drones.drones
            }

            console.log({ drones })
            ws.send(JSON.stringify(DRONE_PILOTS_DB.drones));
        }, 5_000);
    }

    ws.onclose = () => {
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
