import './App.css';
import { useEffect } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:4000");

function App() {
  
  function sendMessage(){
    console.log("HELLLLLLLLLLLLP HELP MEEEEEEEEEEEEEEE");
    socket.emit("sent_message", { message: "womp womp lil bro" });
  }
  useEffect(() => {
    socket.on("received_message", (data) => {
      alert(data.message);
    });
  }, [socket]);
  
  return (
    <div className="App">
      <button onClick={sendMessage}>SOS</button>
    </div>
  );
}

export default App;
