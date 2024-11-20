import './App.css';
import React, { Component, useEffect } from "react";
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import io from "socket.io-client";
import Home from './components/home/Home';
import Game from './components/gameHub/game'

const socket = io.connect("http://localhost:4000");

function App() {
  
  function sendMessage(){
    console.log("HELLLLLLLLLLLLP HELP MEEEEEEEEEEEEEEE");
    socket.emit("sent_message", { message: "lmao" });
  }
  /*useEffect(() => { //THIS HOOK ISN'T NECESSARY???? lmao it's not
    socket.on("received_message", (data) => {
      alert(data.message);
    });
  }, [socket]);*/
  socket.on("received_message", (data) => {
    alert(data.message);
  });
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path = '/' Component = {Home}/>
          <Route path = '/game' Component = {Game}/>
        </Routes>
      </BrowserRouter>
      <button onClick={sendMessage}>SOS</button>
    </div>
  );
}

export default App;
