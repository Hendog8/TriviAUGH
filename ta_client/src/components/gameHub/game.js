import React, { Component, useState } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
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
            host: false, //indicates if you're the host or not

            additionalGamer: {}, //rather than replace gamers array,
                                 //use both? could work NO that's actually so much worse  
            firstLoop: true, //simple var that lets us make gamerList only once
                            //hopefully, at least
        }
        this.addGamer = this.addGamer.bind(this);
        this.sendReady = this.sendReady.bind(this);
    }

    componentDidMount(){
        console.log("huh");
        //axios may actually be unnecessary
        this.socket = io.connect('http://localhost:4000');
        /*this.socket.on('host_joined', (data) => { //ain't running
            console.log("host connection")
            this.socket.emit("game_ready", {running: data}); //this doesn't run?
        });*/
        //this.socket.emit("game_ready", {running: true});
        this.sendReady();
        console.log("huh2");
        this.socket.on('joined', (data) => {
            console.log("HELP");
            this.addGamer(data.name);
        });

        let oldGamers = [];
        console.log(this.props.accepting);
        if(this.props.accepting){
            let {joinedbefore} = this.props;
            for(let x = 0; x < joinedbefore.length; x++){
                oldGamers.push(joinedbefore[x]);
            }
        }
        this.setState({ gamers: oldGamers });
    }

    /*componentWillUpdate(){
        this.setState({ firstLoop: false });
    }*/

    importQuestions(){
        /*imported = [{query:"What?", correct:["who", "how"], incorrect:["where", "why"]},
                    {query: "which of the following songs place in Mario Judah's most streamed?", correct:["die very rough", "miss the rage"], incorrect:["all red", "sky"]}];
        this.setState({
            questions: imported,
        })*/
    }

    addGamer(n){
        console.log("A gamer is gaming " + n);
        let gamer = {
            //id: i,
            nickname: n,
            score: 0,
            selectedAnswers: [],
        }
        let newGamers = [...this.state.gamers];//man spread syntax is so convenient
        newGamers.push(gamer);
        this.setState({
            gamers: newGamers
        })
        this.setState({ additionalGamer: gamer });
    }

    sendReady(){
        console.log("yippee! yippee! yippee!");
        this.socket.emit("game_ready", {running: true});
    }

    endGame(){
        console.log("game over");
        this.socket.emit("game_ended", {gamers: []});
    }

    render(){
        let {gamers, questions, questionNum, timer, started, hoster, additionalGamer, firstLoop} = this.state;
        let {joinedbefore, accepting} = this.props;
        let gamerList = [];
        if(firstLoop){
            for(const x of joinedbefore){
                gamerList.push(x);
            }
        }
        for(const y of gamers){
            gamerList.push(y);
        }
        //gamerList.push(additionalGamer);
        //solution ONLY works if all instances are at least *created* when the first player joins. Is there a way to store on server side?
        //I swear it worked the first time what happened
        //works for the first two instances, more have repetition for some reason
            //like the whole list repeats, if the first instance shows "g, a, m, e" the third will have "g, a, m, e, g, a, m, e"
        
        /*let yep = true;
        if(accepting && yep){
            for(const x of gamers){
                joinedbefore.push(x);
            }
           joinedbefore.push(additionalGamer);
           yep = false;
        }*/
        /*if(gamers[0] != null){
            let gamerNum = gamers.length; //last index of gamers array
        } else {    
            let gamerNum = 0;
        }*/
        return(
            <div className="game">
                { !started ? //need to display player usernames, maybe game settings (time, number of questions, etc.), and need a big ol start button of course
                <div className="g-hub">
                    { hoster ? //host's page
                        <div className="g-hostview">
                            
                        </div>
                    : //players' page
                        <div className="g-gamerview">

                        </div>
                    }
                    { gamerList.map((gamer, index) => (
                        <li key={index}>{gamer.nickname}</li>
                    ))}
                    <p>wassup gang</p>
                    <button onClick={this.sendReady}>allow players to join</button>
                </div>
                : //this is the part with the actual game, likely gonna be the most difficult thing to code here
                <div className="g-gaming">
                    <button onClick={this.sendReady}>allow players to join</button>
                </div>
                }
                <Link to="/">
                    <button>yeah get me out of here</button>
                </Link>
            </div>
        )
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
