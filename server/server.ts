import express from "express"
import getDrones from "./getDrones";

const app = express()
const PORT = 3001;


app.get('/', (_, res) => {
    res.send('Hello drones world!');
})

app.get('/drones', async (_, res) => {
    const drones = await getDrones()

    res.send(drones)
})

app.listen(PORT, () => {
    console.log("server running in port 3001");
})
