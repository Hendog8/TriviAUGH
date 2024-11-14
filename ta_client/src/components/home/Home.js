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
            nick: ""
        }
        this.goHost = this.goHost.bind(this);
        this.goGame = this.goGame.bind(this);
        this.joinGame = this.joinGame.bind(this);

        //All this component has to do is redirect player to be players
        //and the host to be the host

        //must pass along proper info

        //must accept a password (host) and nickname (player)
            //the way kahoot clone does it is to have a method that changes the pin every time the input box changes,
            //then the button activates a method that makes use of that updated state

        //"GO!" button that emits whatever depending on whether or not the password is there (whether host or nah)
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

    joinGame(){
        console.log("wazzzzzaaaaaaaaaaaa");
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
                    </div>
                    :
                        host
                        ?
                        <div className="h-password">
                            { this.state.pass === key
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
