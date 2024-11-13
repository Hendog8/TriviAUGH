const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {origin:"http://localhost:3000", methods: ["GET", "POST"]},
});

server.listen(4000, () => { console.log("listening on *:4000");});

io.on("connection", (socket) => {

    console.log("you are being helped! :cool:")

    socket.on("sent_message", (data) => {
        socket.broadcast.emit("received_message", data);
        //.broadcast emits to all but self, 
        //emit is supposed to emit to all including self 
            //but seems to just emit to self once per instance
    });

    socket.on("joining", (data) => {
        socket.emit('joined', {name:data.nickname, id:socket.id});
    })
});
