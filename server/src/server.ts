import express from "express"
import path from "path";
import * as io from 'socket.io';
import * as http from 'http';
import getDrones from "./getDrones";
import { DronesPilotList } from "./types";

const app = express()
const server = http.createServer(app);
const socketServer = new io.Server(server, {
    path: '/drones'
});

let DRONE_PILOTS_DB: DronesPilotList = {
    drones: [],
};
const PORT = process.env.PORT || 3001
const REFRESH_RATE = 2_000

socketServer.on('connection', async (socket: io.Socket) => {
    console.log('connected to send violating drones');

    let intervalId: NodeJS.Timer = setInterval(async () => {
        const drones = await getDrones(DRONE_PILOTS_DB);

        DRONE_PILOTS_DB = {
            drones: drones.drones
        }

        socket.emit('drones', JSON.stringify(drones.drones))
    }, REFRESH_RATE);

    socket.on('disconnect', () => {
        console.log('disconnected');

        clearInterval(intervalId)
    });
});

app.use(express.static(path.resolve(__dirname, "../../client/build")));

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
});

app.get('/drones', async (_, res) => {
    const combinedDrones = await getDrones(DRONE_PILOTS_DB)

    DRONE_PILOTS_DB = combinedDrones

    res.send(combinedDrones)
})

app.use(function (_, res, __) {
    res.status(404).send("Sorry, that page doesn't exist!");
});

server.listen(PORT, () => {
    console.log(`server running in port ${PORT}`);
})
