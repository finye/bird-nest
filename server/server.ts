import express from "express"

const app = express()
const PORT = 3001;

app.get('/', (req,res) => {
    res.send('Hello drones world!');
})

app.listen(PORT, () => {
    console.log("server running in port 3001");
})

