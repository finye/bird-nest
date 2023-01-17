import express from "express"
import path from "path";
import * as WebSocket from 'ws'
import getDrones from "./getDrones";
import { DronesPilotList } from "./types";


const app = express()
const PORT = process.env.PORT || 3001

const socket = new WebSocket.Server({ port: 8080 });

let DRONE_PILOTS_DB: DronesPilotList = {
    drones: [],
};

socket.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log('received: %s', message);
    });

    setInterval(async () => {
        const drones = await getDrones(DRONE_PILOTS_DB);

        DRONE_PILOTS_DB = {
            drones: drones.drones
        }

        console.log({ drones })
        ws.send(JSON.stringify(DRONE_PILOTS_DB.drones));
    }, 5000);
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