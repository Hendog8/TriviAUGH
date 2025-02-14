import React, { Component } from 'react';
import Timer from './Timer.js';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

class Waiting extends Component {
    constructor(){
        super();
        this.state = {
            //idk what this needs in its state ngl
            //really just a shell for timer to live through
            //so I can use timer elsewhere without needing 
            //to render everything within timer's file
        }

    }

    componentDidMount(){
        this.socket = io.connect('http://localhost:4000');

        this.socket.on('time_up', (data) => {
            if(data === this.props.tempID){
                console.log("time to hop in");
                useNavigate('/game/game');
            } else {
                console.log("time for someone else to hop in");
            }
        });
    }

    render(){

        return(
            <div className="waiting">
                <p className="w-announcment">Loading, this'll only take a moment</p>
                <Timer time={10} tempID={this.props.tempID}/>
            </div>
        )
    }
}

export default Waiting;
