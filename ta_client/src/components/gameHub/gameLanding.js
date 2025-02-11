import React, { Component, useState } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import Playing from './gameStart';


class Game extends Component {
    constructor(){
        super();
        this.state = {
            gamers: [], //array of player objects
                        //includes name, score, and an array of answers for the current question
                        questions: [{ query:"0. What?", correct:["who", "how"], incorrect:["where", "why"], ans:["who", "where", "why", "how"] },
                        { query: "1. Which of the following songs place in Mario Judah's top 5 most streamed (on Spotify)?", correct:["die very rough", "bih yah"], incorrect:["all red", "miss the rage"], ans: ["miss the rage", "sky", "die very rough", "bih yah"] },
                        { query: "2. ", correct:["1", "2", "3"], incorrect:["4"], ans:["1", "2", "3", "4"] },
                        { query: "3. ", correct:["1", "2", "3", "4"], incorrect:[], ans:["4", "3", "2", "1"] },
                        { query: "4. ", correct:[], incorrect:["1", "2", "3", "4"], ans:["2", "4", "1", "3"] },
                        { query: "5. ", correct:["6"], incorrect:["7", "8", "9"], ans:["6", "7", "8", "9"] },], 
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
            me: {nickname: "host", score: 0, selectedAnswers: []}, 
                    //the gamer that created this instance.
                    //used to pass name to the actual game for scorekeeping
            meTest: true, //use this to check a single if statement of the first gamer to join.

            id: -1, //where the player is in the list
                    //if -1, it's host.
            playing: false, //if the component is Playing
                            //man this is too many state elements
            scoreTracker: 0, //tracks which score player should get
                             //scores along a negative square root graph, arbitrarily -45sqrt(x) + 500 for now
            questionNav: 0, //question number to navigate to with toQ
                            //look for a simpler method to do this
        }
        this.addGamer = this.addGamer.bind(this);
        this.sendReady = this.sendReady.bind(this);
        this.startGame = this.startGame.bind(this);
        this.playGame = this.playGame.bind(this);
        this.nextQ = this.nextQ.bind(this);
        this.handleQ = this.handleQ.bind(this);
        this.toQ = this.toQ.bind(this);
    }

    componentDidMount(){
        let {joinedbefore, host} = this.props;
        console.log("huh " + joinedbefore);
        if(!host){
            this.setState({ me: joinedbefore[joinedbefore.length-1], id: joinedbefore.length-1 });
        }
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

        /*if(!host && joinedbefore.length > 0){
            this.setState({ me: joinedbefore[joinedbefore.length-1]});
        }
        console.log("on mount, I am " + this.state.me.nickname);*/

        this.socket.on('joined', (data) => {
            console.log("HELP, I'm dying!");
            
            console.log("host & id check: " + host + ", " + this.state.id);
            if(!host && this.state.id == -1){
                console.log("Should be number " + data.id);
                this.setState({ id: data.id });
                console.log("Number " + this.state.id);
            }
            
            console.log("fujangpuionduivnasuidnvaiundvioasneuivansei");
            let newTest = true;
            for(const g of this.state.gamers){
                if(g.nickname === data.name){
                    console.log(data.name + " is already taken");
                    console.log(g.nickname + " is also already taken");
                    newTest = false;
                }
            }
            if(newTest){
                this.addGamer(data.name);
                if(host){
                    console.log("trying to add " + data.name + " one more time");
                    this.socket.emit("joining", {message: data.name});
                }
            }
        });

        let oldGamers = [];
        //console.log(this.props.accepting);
        //if(this.props.accepting){
            /*if(this.state.meTest && !host){
                console.log("AUIONAOINVUOINS " + joinedbefore.toString());
                this.setState({
                    meTest: false,
                    //me: joinedbefore[joinedbefore.length-1]
                });
            }*/
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
        this.socket.on("game_started", (data) => {
            this.setState({ started: true });
        });

        this.socket.on('answers_submitted', (data) => {
            console.log(data.name + " answers received");
            //whoops forgot I need to actually check which answers are right lmao
            let score = -45 * Math.sqrt(this.state.scoreTracker) + 500;
            this.setState({ scoreTracker: this.state.scoreTracker++ });
            //reset to 0 when changing questions
        });

        this.socket.on('question_change', (data) => {
            console.log("question changed " + data.index);
            if(data.index === -1){
                this.setState({ questionNum: this.state.questionNum++});
            } else {
                //allows for the potential to use this one method to either increment the question or select a specific question
                this.setState({ questionNum: data.index });
            }
            this.setState({ scoreTracker: 0 });
        });

        /*if(!host && this.state.gamers.length == 0 && joinedbefore.length > 0){
            console.log("testing adding " + joinedbefore[joinedbefore.length-1].nickname);
            this.addGamer(joinedbefore[joinedbefore.length-1].nickname);
            //joinedbefore.pop();
        }*/
    }

    componentDidUpdate(){
        if(this.state.meTest){
            if(this.state.gamers != null && this.state.gamers.length < this.state.id){
                this.setState({ me: this.state.gamers[this.state.id], meTest: false });
            }
        }
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
        if(!this.props.host && this.state.id == -1){
            this.setState({ id: this.state.gamers.length });   
        }
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
        /*if(this.state.me.nickname === "host" && !this.props.host){
            console.log("Metesting: " + gamer.nickname);
            this.setState({ me: {nickname: gamer.nickname, score: 0, selectedAnswers: []} });
        }
        console.log("I am " + this.state.me.nickname);*/
    }

    sendReady(){
        console.log("yippee! yippee! yippee!");
        this.socket.emit("game_ready", {running: true});
    }

    endGame(){
        console.log("game over");
        this.socket.emit("game_ended", {gamers: []});
    }

    startGame(){
        console.log("game start!");
        this.socket.emit("game_start", {gamers: this.state.gamers});
    }

    playGame(){
        console.log("now playing");
        this.setState({ playing: true });
    }

    nextQ(){
        console.log("going next");
        this.socket.emit('question_changing', {index: -1});
    }

    handleQ(e){
        this.setState({ questionNav: e.target.value });
    }
    
    toQ(){
        console.log("going to " + this.state.questionNav);
        this.socket.emit('question_changing', {index: this.state.questionNav});
    }

    render(){
        let {gamers, questions, questionNum, timer, started, hoster, additionalGamer, firstLoop, me, id} = this.state;
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

        /*if(!host && me.nickname === "host"){
            me = gamerList[gamerList.length-1]
        } else*/ /*if(!host && id !== -1){
            me = gamerList[id];
            console.log("I'm " + gamerList[id].nickname);
        } else if(!host && me.nickname === "host" && gamerList.length > 0){
            console.log("Checking " + gamerList[gamerList.length - 1].nickname);
        }*/
        
        if(id >= 0){
            me = gamerList[id];
        } else if(!host && gamerList.length > 0){
            me = gamerList[gamerList.length-1];
            this.setState({id: gamerList.length-1});
            //improper pratice but given the if it won't cause looping.
            //still want to remove any setState from render though
        } else if(!host && gamerList.length === 0){
            console.log("there's some kinda bug happening here");
            //okay so gamerList just isn't filling soon enough.
            //employ a waiting screen?
        } else {
            console.log("THIS MUST BE HOST");
            me = {nickname: "host", score: 0, selectedAnswers: []}
        }
        console.log("I'm actually " + me.nickname);


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

                {host || !started ?
                <div className="g-waiting">
                    { !started ? //need to display player usernames, maybe game settings (time, number of questions, etc.), and need a big ol start button of course
                    <div className="g-hub">
                        { host ? //host's page
                            <div className="g-hostview">
                                <p className="g-hostcheck">you're me, right?</p>
                                <button classname="g-hoststart" onClick={this.startGame}>if so, you can START GAME!</button>
                            </div>
                        : //players' page
                            <div className="g-gamerview">
                                <p className="g-gamercheck">and you aren't. You're {me.nickname}</p>
                            </div>
                        }
                        { gamerList.map((gamer, index) => (
                            <li key={index}>{gamer.nickname}</li>
                        ))}
                        <p>wassup gang</p>
                        <button onClick={this.sendReady}>allow players to join</button>
                    </div>
                    : //this is the part with the actual game, likely gonna be the most difficult thing to code here
                    <div className="g-ready">
                        <p className="g-gamernotice">The game has begun!</p>
                        <button onClick={this.sendReady}>JOIN!!!!</button>
                        <button onClick={this.nextQ}>Next Question</button>
                        <br />
                        <button onClick={this.toQ}>Go to Question</button>
                        <input type="number" onChange={this.handleQ} />
                    </div>
                    //sendReady here is gonna need to change to a way to change components to Playing
                    }
                    <Link to="/">
                        <button>yeah get me out of here</button>
                    </Link>
                </div>
                :
                <div className="g-ready">
                        {this.state.playing ?
                            <div className="g-waiting">
                                <p className="g-gamernotice">The game has begun!</p>
                                <button onClick={this.playGame}>JOIN!!!!</button>
                            </div>
                        :
                        <Playing name={me.nickname} id={this.id}/>
                        }  
                    </div>
                }
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
