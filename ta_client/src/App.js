import './App.css';
import React, { Component, useEffect } from "react";
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import io from "socket.io-client";
import Home from './components/home/Home';
import Game from './components/gameHub/game'

const socket = io.connect("http://localhost:4000");

function App() {
  
  var running;

  function sendMessage(){
    console.log("HELLLLLLLLLLLLP HELP MEEEEEEEEEEEEEEE");
    socket.emit("sent_message", { message: "lmao" });
  }
  /*useEffect(() => { //THIS HOOK ISN'T NECESSARY???? lmao it's not
    socket.on("received_message", (data) => {
      alert(data.message);
    });
  }, [socket]);*/

  function restart(){
    running=true;
    console.log("stopping host" + running);
  }

  socket.on("received_message", (data) => {
    alert(data.message);
  });

  socket.on("join_ready", (data) => {
    running = data.running;
  });
  // <Route path = '/game' render={(props) => <Game joinable=running {...props} />} />
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          { running ? //learning how to pass props
            <Route path = '/' Component={() => (<Home joiner={true} />)} />
            :
            <Route path = '/' Component={() => (<Home joiner={false} />)} />
          }
          <Route path = '/game' Component = {Game} />
        </Routes>
      </BrowserRouter>
      <button onClick={sendMessage}>SOS</button>
      <button onClick={restart}>nvm don't need your help</button>
    </div>
  );
}

export default App;
