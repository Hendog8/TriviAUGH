import './App.css';
import React, { Component } from "react";
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import io from "socket.io-client";
import Home from './components/home/Home';
import { Game, Gamer } from './components/gameHub'

const socket = io.connect("http://localhost:4000");

function App() {
  
  function sendMessage(){
    console.log("HELLLLLLLLLLLLP HELP MEEEEEEEEEEEEEEE");
    socket.emit("sent_message", { message: "lmao" });
  }
  /*useEffect(() => { THIS HOOK ISN'T NECESSARY????
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
          <Route path = '/host' Component = {Game}/>
          <Route path = '/join' Component = {Gamer}/>
        </Routes>
      </BrowserRouter>
      <button onClick={sendMessage}>SOS</button>
    </div>
  );
}

export default App;
