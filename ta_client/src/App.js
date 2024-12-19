import './App.css';
import React, { Component, useEffect } from "react";
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import io from "socket.io-client";
import Home from './components/home/Home';
import Game from './components/gameHub/game'

const socket = io.connect("http://localhost:4000");

function App() {
  
  var running;
  var gamers = [];
  var gaming = false; //I think this is super unnecessary
  var hosting = false; //this is also probably unnecessary
  var started = false;
  var myself = {};

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

  function addGamer(n){
      console.log("A gamer is gaming " + n);
      let gamer = {
          //id: i,
          nickname: n,
          score: 0,
          selectedAnswers: [],
      }
      gamers.push(gamer);
      gaming = true;
  }

  socket.on("received_message", (data) => {
    alert(data.message);
  });

  socket.on("host_joined", (data) => {
    running = data.joining;
  });

  socket.on('joined', (data) => {
    console.log("HELP");
    hosting = false;
    addGamer(data.name);
  });

  socket.on('host_joined', (data) => {
    console.log("this is a host");
    hosting = true;
  });

  socket.on('game_started', (data) => {
    console.log("starting game!");
    started = true;
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
          { started ?
            <Route path = '/game/game' Component = {() => (<Game joinedbefore={gamers} host={false} />)} />
            :
            <Route path = '/game/game' Component = {() => (<Game joinedbefore={gamers} host={false} />)} />
          }
          { started ?
            <Route path = '/game/host' Component = {() => (<Game joinedbefore={gamers} host={true} />)} />
            :
            <Route path = '/game/host' Component = {() => (<Game joinedbefore={gamers} host={true} />)} />
          }
        </Routes>
      </BrowserRouter>
      <button onClick={sendMessage}>SOS</button>
      <button onClick={restart}>nvm don't need your help</button>
    </div>
  );
}

export default App;
