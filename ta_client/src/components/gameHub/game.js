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
            hoster: false, //indicates if you're the host or not
                         //should be a prop instead?
            additionalGamer: {}, //rather than replace gamers array,
                                 //use both? could work NO that's actually so much worse  
            firstLoop: true, //simple var that lets us make gamerList only once
                            //hopefully, at least
            me: {nickname: "host", score: null, selectedAnswers: null}, 
                    //the gamer that created this instance.
                    //used to pass name to the actual game for scorekeeping
            meTest: true, //use this to check a single if statement of the first gamer to join.

        }
        this.addGamer = this.addGamer.bind(this);
        this.sendReady = this.sendReady.bind(this);
    }

    componentDidMount(){
        let {joinedbefore, host} = this.props;
        console.log("huh");
        //axios may actually be unnecessary
        this.socket = io.connect('http://localhost:4000');
        this.socket.on('host_joined', (data) => { //ain't running
            console.log("host connection");
            this.sendReady();
            //this.socket.emit("game_ready", {running: data}); //this doesn't run?
        });
        //this.socket.emit("game_ready", {running: true});
        //this.sendReady();
        console.log("huh2");
        this.socket.on('joined', (data) => {
            console.log("HELP, I'm dying!");
            console.log("fujangpuionduivnasuidnvaiundvioasneuivansei");
            this.addGamer(data.name);
        });

        let oldGamers = [];
        //console.log(this.props.accepting);
        //if(this.props.accepting){
            if(this.state.meTest && !host){
                console.log("AUIONAOINVUOINS " + joinedbefore.toString);
                this.setState({
                    meTest: false,
                    //me: joinedbefore[joinedbefore.length-1]
                });
            }
            for(let x = 0; x < joinedbefore.length; x++){
                oldGamers.push(joinedbefore[x]);
                /*if(this.state.meTest && x == joinedbefore.length-1 && !host){
                    console.log("Metesting: " + joinedbefore[x].nickname);
                    this.setState({
                        meTest: false,
                        me: joinedbefore[x]
                    });
                }*/
            }
        console.log("AHHHHHHHHHHHHHH oldGamers: " + oldGamers.toString());
        /*if(this.state.meTest && !host){
            console.log("Metesting: " + oldGamers[oldGamers.length-1].nickname);
            this.setState({
                meTest: false,
                me: oldGamers[oldGamers.length-1]
            });
        }*/
        //}
        this.setState({ gamers: oldGamers });
        //console.log("I'm " + me.nickname);
        console.log("hosting? " + this.props.host);
        /*if(!this.props.host){
            this.setState({ me: oldGamers[oldGamers.length-1] });
        }*/
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
            /*toString: function() {
                return "nickname: " + this.nickname;
            }*/
        }
        let newGamers = [...this.state.gamers];//man spread syntax is so convenient
        console.log("I HATE YOU I HATE YOU I HATE YOU");
        newGamers.push(gamer);
        this.setState({
            gamers: newGamers
        });
        //this.setState({ additionalGamer: gamer });
        console.log("someone please send help");
        //if(this.state.meTest && !this.props.host){
        if(this.state.me.nickname === "host"){
            console.log("Metesting: " + gamer.nickname);
            this.setState({ me: gamer });
        }
        console.log("I am " + this.state.me.nickname);
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
        let {gamers, questions, questionNum, timer, started, hoster, additionalGamer, firstLoop, me} = this.state;
        let {joinedbefore, host} = this.props;
        console.log("gamers: " + gamers);
        console.log("joinedBefore: " + joinedbefore);
        let gamerList = [];
        for(const x of joinedbefore){
            gamerList.push(x);
        }
        for(const y of gamers){
            let nonpusher = false;
            for(const z of gamerList){
                if(y.nickname === z.nickname){
                    nonpusher = true;
                }
            }
            if(!nonpusher){
                gamerList.push(y);
            }
        }
        console.log("gamerList: " + gamerList);
        console.log("I'm " + me.nickname);
        //let myName = me.nickname;
        //gamerList.push(additionalGamer);
        //we're so back
        //only works in strict mode tho
        //just have it double emit by default?
        //need a way to ensure the way the instance sending the player also receives the player.

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
                    { host ? //host's page
                        <div className="g-hostview">
                            <p className="g-hostcheck">you're me, right?</p>
                        </div>
                    : //players' page
                        <div className="g-gamerview">
                            <p className="g-gamercheck">and you aren't. You're {"myName"}</p>
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
