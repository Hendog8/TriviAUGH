import React, { Component, useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:4000');

function Timer ({ time, type, tempID }) {
    const [length, setLength] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setLength(length + .5) 
        }, 500);

        if (length === time) {
            clearInterval(interval);
            setLength(1);
            if (type === 'waiting') {
                socket.emit('timer_finished', tempID);
            } else if (type === 'question') {
                //socket.emit('timer_finished', tempID);//'all');
            } else if (type === 'host_question') {
                socket.emit('timer_finished', { who: 'all' });
            }
        }

        return () => clearInterval(interval);

    }, [length]);

    return(
        <div>
            <p>{time - length}</p>
        </div>
    );
}

export default Timer;
