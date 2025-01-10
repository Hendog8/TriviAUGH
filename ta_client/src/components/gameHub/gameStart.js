import React, { Component } from 'react';
import io from 'socket.io-client';

class Playing extends Component {
    constructor(){
        super();
        this.state = {
            //id: '',
            nickname: '',
            score: 0,
            selectedAnswers: [],

        }
    }

    componentDidMount(){
        this.socket = io.connect('http://localhost:4000');
        
        //try to send nickname via props

        /*this.setState({
            nickname: this.props.nickname
        });*/

        this.socket.on("player_updated", (data) => {
            console.log("player update received");
            this.setState({
                nickname: data.nickname,
                score: data.score,
                selectedAnswers: data.selectedAnswers
            });
        });
    }

    componentDidUpdate(){
        this.socket.emit('player_update', this.state);
    }

    /*setName(newName){
        //let x = newName;
        this.setState({
            nickname: newName //nickname: x
        });
    }*/

    joinGame(){
        this.socket.emit('joining', this.state);
    }

    render(){
        let { nickname, score, selectedAnswers } = this.state;

        <div className='playingGame'>
            <p className='p-name'>{nickname + '; ' + score}</p>
            <div className='p-answers'>
                <button className='p-a1'>this is the first answer</button>
                <button className='p-a2'>this is the second answer</button>
                <button className='p-a3'>this is the third answer</button>
                <button className='p-a4'>this is the fourth answer</button>
            </div>
        </div>
    }
}

export default Playing;
