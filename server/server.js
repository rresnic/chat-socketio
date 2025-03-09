const express = require("express");
const app = express();
const http = require("http");
const cors = require('cors');
const {Server} = require('socket.io');
const PORT = 3003;

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET","POST","PUT","DELETE"]
    }
} )


io.on("connection", (socket)=> {
    console.log(`socket connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data)
        console.log(`User ${socket.id} joining room ${data}`);
    })

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    })
    
    socket.on("disconnect", () => {
        console.log(`socket disconnected: ${socket.id}`);
    }) 
})

server.listen(PORT, ()=> {
    console.log(`Server running on ${PORT}`)
});
