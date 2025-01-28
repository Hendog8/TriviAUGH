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

    let playerNum = -1;

    console.log("you are being helped! :cool:")

    socket.on("sent_message", (data) => {
        socket.broadcast.emit("received_message", data);
        //.broadcast emits to all but self, 
        //emit is supposed to emit to all including self 
            //but seems to just emit to self once per instance
    });

    socket.on("joining", (data) => {
        playerNum++;
        console.log(data + " " + playerNum);
        socket.broadcast.emit('joined', {name:data.message, id:playerNum});
    });

    socket.on("host_joining", (data) => {
        console.log("hosting??????")
        socket.broadcast.emit('host_joined', {running: data.joining});
    });

    socket.on("game_ready", (data) => {//this never catches anything?
        console.log("no, not yippee.");
        socket.broadcast.emit("join_ready", {joinable: data.running});
    });

    socket.on("game_ended", (data) => {
        console.log("ending");
        socket.broadcast.emit("clean_slate", {gamers: data.gamers});
    });

    socket.on("player_update", (data) => {
        console.log("player update sending");
        socket.broadcast.emit("player_updated", data);
    });

    socket.on("game_start", (data) => {
        console.log("starting game!");
        socket.broadcast.emit("game_started", data);
    })
});
