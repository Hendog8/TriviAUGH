import React, { Component } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';

class Home extends Component{
    constructor(){
        super();
        this.state = {
            host: false,
            gamer: false,
            key: "thisIsThePassword",
            pass: "", //this is the container for password guesses
            nick: "" //nickname, of course
        }
        this.goHost = this.goHost.bind(this);
        this.goGame = this.goGame.bind(this);
        this.handlePass = this.handlePass.bind(this);
        this.handleNick = this.handleNick.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.emitTest = this.emitTest.bind(this);
    }

    componentDidMount(){
        this.socket = io.connect('http://localhost:4000');
        //REPLACE WITH io('/') WHEN DEPLOYING (I THINK)
    }

    goHost(){
        this.setState({
            host: true,
            gamer: false
        });
    }
    
    goGame(){
        this.setState({
            host: false,
            gamer: true
        });
    }

    handlePass(e){
        this.setState({
            pass: e.target.value
        });
    }

    handleNick(e){
        this.setState({
            nick: e.target.value
        });
    }

    joinGame(){
        console.log("JOINING!");
        this.socket.emit("sent_message", {message: this.state.nick});
    }

    emitTest(){
        this.socket.emit("sent_message", {message: "huh?"});
    }

    render(){
        let {host, gamer, key} = this.state;
        return(
            <div className="h-hub">
                {
                    !host && !gamer
                    ?
                    <div className="h-land">
                        <p className="h-choice">How would you like to join triviAUGHHHHHH?</p>
                        <button className="h-hoster" onClick={this.goHost}>I'd like to host.</button>
                        <button className="h-gamerer" onClick={this.goGame}>I'd like to play.</button>
                        <br />
                        <button onClick={this.emitTest}>SOS2</button>
                    </div>
                    :
                        host
                        ?
                        <div className="h-password">
                            { this.state.pass !== key
                                ?
                                <p className="h-p-waiting">Enter the SECRET PASSWORD:</p>
                                :
                                <div className="h-p-correct">
                                    <p> Correct. Welcome back, Thomas.</p>
                                    <Link to='/host'>
                                        <button>GO!</button>
                                    </Link>
                                </div>
                            }
                            <input type="password" value={this.state.pass} onChange={this.handlePass} />
                        </div>
                        :
                        <div className="h-nickname">
                            <p>Enter your nickname here:</p>
                            <input type="text" value={this.state.nick} onChange={this.handleNick} />
                            <Link to="/join">
                                <button onClick={this.joinGame}>GO!</button>
                            </Link>
                        </div>
                }
            </div>
        )
    }
}

export default Home;
