import React, { useState, useEffect } from 'react';
import Timer from './Timer.js';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const socket = io.connect('http://localhost:4000');

function Waiting({ tempID }){

    const navigate = useNavigate();

    socket.on('time_up', (data) => {
        if(data === tempID){
            console.log("time to hop in");
            navigate('/game/game');
            //not supposed to be here, socket.join????
        } else {
            console.log("time for someone else to hop in");
        }
    });
    return(
            <div className="waiting">
                <p className="w-announcment">Loading, this'll only take a moment</p>
                <Timer time={2} type={'waiting'} tempID={tempID}/>
            </div>
    )
}

export default Waiting;
