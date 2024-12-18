import React, { Component } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';

class Home extends Component{
    constructor(){
        super();
        this.state = {
            host: false,
            gamer: false,
            joinable: false, //whether or not a host is already running
            warning: false,
            key: "pword",
            pass: "", //this is the container for password guesses
            nick: "", //nickname, of course
        }
        this.goHost = this.goHost.bind(this);
        this.goGame = this.goGame.bind(this);
        this.handlePass = this.handlePass.bind(this);
        this.handleNick = this.handleNick.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.notJoin = this.notJoin.bind(this);
        this.hostJoin = this.hostJoin.bind(this);
        this.emitTest = this.emitTest.bind(this);
    }

    componentDidMount(){
        this.socket = io.connect('http://localhost:4000');
                                //REPLACE WITH REAL SERVER ADDRESS WHEN DEPLOYING
        /*this.socket.on("received_message", (data) => {
            alert(data.message);
        });*/
        this.socket.on("join_ready", (data) => {
            console.log("host present");
            this.setState({ joinable: data });
        });
        console.log("Joiner: " + this.props.joiner);
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
        this.setState({ pass: e.target.value });
    }

    handleNick(e){
        this.setState({ nick: e.target.value });
    }

    joinGame(){
        console.log("JOINING!");
        this.socket.emit("joining", {message: this.state.nick});
    }

    notJoin(){
        console.log("no host");
        this.setState({ warning: true });
    }

    hostJoin(){
        console.log("host joining");
        this.socket.emit("host_joining", {joining: true});
    }

    emitTest(){
        this.socket.emit("sent_message", {message: "huh?"});
    }

    render(){
        let {host, gamer, joinable, warning, key} = this.state;
        let {joiner} = this.props;
        console.log("Joinable: " + joinable + " Joiner: " + joiner);
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
                        host ?
                        <div className="h-password">
                            { this.state.pass !== key
                                ?
                                <p className="h-p-waiting">Enter the SECRET PASSWORD:</p>
                                :
                                <div className="h-p-correct">
                                    <p> Correct. Welcome back, Thomas.</p>
                                    <Link to='/game/host'>
                                        <button onClick={this.hostJoin}>GO!</button>
                                    </Link>
                                </div>
                            }
                            <input type="password" value={this.state.pass} onChange={this.handlePass} />
                        </div>
                        :
                        <div className="h-nickname">
                            <p>Enter your nickname here:</p>
                            <input type="text" value={this.state.nick} onChange={this.handleNick} />
                            {joinable || joiner ?
                                <Link to="/game/game">
                                    <button onClick={this.joinGame}>GO!</button>
                                </Link>
                                :
                                <div className="h-unjoinable">
                                    <button onClick={this.notJoin}>GO!</button>
                                    {warning ?
                                        <div className="h-warning">
                                            <p>There are no triviAUGH games currrently running, so you're unable to join.</p>
                                        </div>
                                    :
                                        <div className="h-warning">
                                            <p>hey gang</p>
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                }
            </div>
        )
    }
}

export default Home;
