import React, { Component, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
//import { connect } from 'react-redux'; what is redux?????


class Game extends Component {
    constructor(){
        super();
        this.state = {
            gamers: [], //array of player objects
                        //includes name, score, and an array of answers for the current question
            questions: [{query:"What?", correct:["who", "how"], incorrect:["where", "why"]},
                        {query: "which of the following songs place in Mario Judah's top 5 most streamed?", correct:["die very rough", "miss the rage"], incorrect:["all red", "sky"]}], 
                        //array of question objects 
                        //each includes question, correct, and incorrect answers
            questionNum: 0, //index of current question in array

            timer: 10, //time in seconds per question
                       //should stay short, don't gotta be 10 tho
            started: false, //dictates if we're actually playing the game
                            //or just in the "lobby"
        }
    }

    componentDidMount(){
        //axios may actually be unnecessary
        this.socket = io('/');
        this.socket.emit("game_ready", {running: true});
        this.socket.on('joined', (data) => {
            console.log("HELP");
            this.addGamer(data.nickname, data.id);
        });
    }

    importQuestions(){
        /*imported = [{query:"What?", correct:["who", "how"], incorrect:["where", "why"]},
                    {query: "which of the following songs place in Mario Judah's most streamed?", correct:["die very rough", "miss the rage"], incorrect:["all red", "sky"]}];
        this.setState({
            questions: imported,
        })*/
    }

    addGamer(n, i){
        let gamer = {
            id: i,
            nickname: n,
            score: 0,
            selectedAnswers: [],
        }
        let newGamers = [...this.state.gamers];//man spread syntax is so convenient
        newGamers.push(gamer);
        this.setState({
            gamers: newGamers
        });
    }

    render(){
        let {gamers, questions, questionNum, timer, started} = this.state;
        <div className="game">
            { !started ? //need to display player usernames, maybe game settings (time, number of questions, etc.), and need a big ol start button of course
            <div className="g-hub">

            </div>
            : //this is the part with the actual game, likely gonna be the most difficult thing to code here
            <div className="g-gaming">

            </div>
            }
        </div>
    }
}

export default Game;
/*class Question extends Component {
    constructor(){
        super();
        this.state = {
            query: "", //the question
            correct: [], //array of correct answers, 0-4 possible
            incorrect: [], //same for incorrect, the two should add to 4 answers total
        }
    }
}*/
