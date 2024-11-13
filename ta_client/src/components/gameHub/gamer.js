import React, { Component } from 'react';
import io from 'socket.io-client';

class Gamer extends Component {
    constructor(){
        super();
        this.state = {
            id: '',
            nickname: '',
            score: '',
            selectedAnswers: [],

        }
    }

    componentDidMount(){
        this.socket = io('/');
        //this.socket.emit('joining', this.state)
    }

    setName(newName){
        //let x = newName;
        this.setState({
            nickname: newName //nickname: x
        });
    }

    joinGame(){
        this.socket.emit('joining', this.state);
    }

    render(){
        <div className='hello?'>

            <button className='hi!'>GO GO GO GO</button>
        </div>
    }
}
