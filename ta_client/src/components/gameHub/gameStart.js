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
        this.setState({ nickname: this.props.name });

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
        return(
            <div className='playingGame'>
                <p className='p-name'>{nickname + '; ' + score}</p>
                <div className='p-questioning'>
                    <p classname='p-question'>this is the question</p>
                    {//if we even end up including the question on the client side, I mean it seems kinda inconvenient space-wise. I was thinking we should do it like Kahoot instead where the question only appears on the host's screen to the displayed to the rest of the game.
                    }
                    <button className='p-a1'>this is the first answer</button>
                    <button className='p-a2'>this is the second answer</button>
                    <button className='p-a3'>this is the third answer</button>
                    <button className='p-a4'>this is the fourth answer</button>
                </div>
            </div>
        )
    }
}

export default Playing;
