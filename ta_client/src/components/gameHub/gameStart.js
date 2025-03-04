import React, { Component } from 'react';
import io from 'socket.io-client';
import Timer from '../home/Timer.js';

class Playing extends Component {
    constructor(){
        super();
        this.state = {
            id: 0,
            nickname: '',
            score: 0,
            selectedAnswers: [false, false, false, false],
            questions: [{ query:"0. What?", correct:["who", "how"], incorrect:["where", "why"], ans:["who", "where", "why", "how"], time:10 },
                        { query: "1. Which of the following songs place in Mario Judah's top 5 most streamed (on Spotify)?", correct:["die very rough", "bih yah"], incorrect:["all red", "miss the rage"], ans: ["miss the rage", "sky", "die very rough", "bih yah"], time:15 },
                        { query: "2. ", correct:["1", "2", "3"], incorrect:["4"], ans:["1", "2", "3", "4"], time:10 },
                        { query: "3. ", correct:["1", "2", "3", "4"], incorrect:[], ans:["4", "3", "2", "1"], time:10 },
                        { query: "4. ", correct:[], incorrect:["1", "2", "3", "4"], ans:["2", "4", "1", "3"], time:10 },
                        { query: "5. ", correct:["6"], incorrect:["7", "8", "9"], ans:["6", "7", "8", "9"], time:10 },], 
                        //question, correct answers, incorrect answers, all answers, time to answer
            questionNum: 0, 
            submitted: false,
            scored: false,
            scoreChange: 0,
        }
        this.selectAnswer = this.selectAnswer.bind(this);
        this.submitAnswers = this.submitAnswers.bind(this);
    }


    componentDidMount(){
        this.socket = io.connect('http://localhost:4000');
        console.log(this.props);
        this.setState({ nickname: this.props.name, id: this.props.id });
        console.log(this.state);

        this.socket.on('selected_answer', (data) => {
            if(data.name === this.state.nickname){
                if(this.state.selectedAnswers[data.answer]){
                    console.log("I'm deselecting " + data.answer);
                } else {
                    console.log("I'm selecting " + data.answer);
                }
                let newAnswers = this.state.selectedAnswers;
                newAnswers[data.answer] = !newAnswers[data.answer];
                this.setState({ selectedAnswers: newAnswers });
            }
        });

        this.socket.on('question_change', (data) => {
            console.log("question changed " + data.index);
            if(data.index === -1){
                this.setState({ questionNum: this.state.questionNum+1});
            } else {
                //allows for the potential to use this one method to either increment the question or select a specific question
                this.setState({ questionNum: data.index });
            }
        });

        

        /*this.socket.on("player_updated", (data) => {
            if(data.nickname === this.state.nickname){
                console.log("player update received");
                if(data.score !== this.state.score || data.selectedAnswers !== this.state.selectedAnswers){
                    this.setState({
                        score: data.score,
                        selectedAnswers: data.selectedAnswers
                    });
                }
            }
        });*/
    }


    /*componentDidUpdate(){
        console.log("player updating");
        this.socket.emit('player_update', this.state);
    }*/


    /*setName(newName){
        //let x = newName;
        this.setState({
            nickname: newName //nickname: x
        });
    }*/


    joinGame(){
        this.socket.emit('joining', this.state);
    }


    selectAnswer(e){
        let a = -1;
        switch(e.target.className){
            case 'p-a1':
                a = 0;
                break;
            case 'p-a2':
                a = 1;
                break;
            case 'p-a3':
                a = 2;
                break;
            case 'p-a4':
                a = 3;
                break;
            default:
                console.log("selection error");
        }
        if(this.state.selectedAnswers[a]){
            console.log("deselecting answer " + a);
        } else {
            console.log("selecting answer " + a);
        }
        this.socket.emit('selecting_answer', { name: this.state.nickname, answer: a });
        /*let newSelectedAnswers = this.state.selectedAnswers;
        newSelectedAnswers[a] = !newSelectedAnswers[a];
        this.setState({ selectedAnswers: newSelectedAnswers });*/
    }

    submitAnswers(){
        console.log("answer submission");
        this.socket.emit('submitting_answers', { name: this.state.nickname, answers: this.state.selectedAnswers, q: this.state.questionNum });
        this.setState({ submitted: true });
    }

    render(){
        let { id, nickname, score, selectedAnswers, questions, questionNum, submitted, scored, scoreChange } = this.state;

        return(
            <div className='playingGame'>
                <p className='p-name'>{nickname + '; ' + id}</p>
                { !submitted ?
                    <div className='p-questioning'>
                        <p className='p-question'>{questions[questionNum].query}</p>
                        {//if we even end up including the question on the client side, I mean it seems kinda inconvenient space-wise. I was thinking we should do it like Kahoot instead where the question only appears on the host's screen to the displayed to the rest of the game.
                        }
                        <button className='p-a1' onClick={this.selectAnswer}>{questions[questionNum].ans[0]}</button>
                        <button className='p-a2' onClick={this.selectAnswer}>{questions[questionNum].ans[1]}</button>
                        <button className='p-a3' onClick={this.selectAnswer}>{questions[questionNum].ans[2]}</button>
                        <button className='p-a4' onClick={this.selectAnswer}>{questions[questionNum].ans[3]}</button>
                        <br />
                        <button className='p-submit' onClick={this.submitAnswers}>submit</button>
                        <br />
                        <Timer time={questions[questionNum].time} type={'question'} />
                    </div>
                    :
                    <div className='p-submitted'>
                        { !scored ?
                            <div className='p-waiting'>
                                <p>You're in! Now we wait for others to submit...</p>
                            </div>
                            :
                            <div className='p-scored'>
                                { 
                                    
                                }
                            </div>
                        }
                    </div>
                }
            </div>
        )
    }
}


export default Playing;
