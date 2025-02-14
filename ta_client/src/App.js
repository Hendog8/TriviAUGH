import './App.css';
import React, { Component, useEffect } from "react";
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import io from "socket.io-client";
import Home from './components/home/Home';
import Game from './components/gameHub/gameLanding';
import Playing from './components/gameHub/gameStart';
import Waiting from './components/home/Waiting';

const socket = io.connect("http://localhost:4000");

function App() {
  
  var running;
  var gamers = [];
  var gaming = false; //I think this is super unnecessary
  var hosting = false; //this is also probably unnecessary
  var started = false;
  var myself = Math.floor(Math.random()*100000000) + ''; //temp id, just here to ensure that I can track an instance.
               //should be pretty secure but you just can't be 100% certain so I'd like to switch to the counting later
               //plus the counting allows for tracking in player arrays which is mad convenient

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
    let newTest = true;
    for(const g of gamers){
      if(g.nickname === data.name){
        //console.log(data.name + " is already taken");
        //console.log(g.nickname + " is also already taken");
        newTest = false;
      }
    }
    if(newTest){
      addGamer(data.name);
    }

    if(data.check === myself){
      console.log(data.name + " is me");
    }
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
            <Route path = '/' Component={() => (<Home joiner={true} tempID={myself}/>)} />
            :
            <Route path = '/' Component={() => (<Home joiner={false} tempID={myself}/>)} />
          }
          { !started ?
            <Route path = '/game/game' Component = {() => (<Game joinedbefore={gamers} host={false} tempID={myself}/>)} />
          ://allows a change to the component if the game is running, letting us not have to code the whole game and the landing in the same file
            <Route path = '/game/game' Component = {() => (<Playing tempID={myself}/>)} />
          }  
          { !started ?
            <Route path = '/game/host' Component = {() => (<Game joinedbefore={gamers} host={true} tempID={myself}/>)} />
            :
            <Route path = '/game/host' Component = {() => (<Game joinedbefore={gamers} host={true} tempID={myself}/>)} />
          }
          <Route path = '/game/waiting' Component = {() => (<Waiting tempID={myself}/>)} />
        </Routes>
      </BrowserRouter>
      <button onClick={sendMessage}>SOS</button>
      <button onClick={restart}>nvm don't need your help</button>
    </div>
  );
}

export default App;
