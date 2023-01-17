import express from "express"
import path from "path";
import getDrones from "./getDrones";
import { DronesPilotList } from "./types";

const app = express()
const PORT = 3001

let DRONE_PILOTS_DB: DronesPilotList = {
    drones: [],
};


app.use(express.static(path.resolve(__dirname, "../build")));

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.get('/drones', async (_, res) => {
    const combinedDrones = await getDrones(DRONE_PILOTS_DB)

    DRONE_PILOTS_DB = combinedDrones

    res.send(combinedDrones)
})


app.listen(PORT, () => {
    console.log("server running in port 3001");
})
