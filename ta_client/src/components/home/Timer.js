import React, { Component } from 'react';
import io from 'socket.io-client';

class Timer extends Component {
    constructor(){
        super();
        this.state = {
            length: 0,
                   //maybe this works? unsure about props within constructors
        }
        this.interval = null;
    }

    componentDidMount(){
        this.socket = io.connect('http://localhost:4000');
        this.interval = setInterval(() => {
            this.setState(prevState => ({ length: prevState.length + 1 }));
        }, 1000);
    }

    componentWillUnmount(){
        this.setState({ interval: clearInterval(this.state.interval) });
    }

    componentDidUpdate(){
        if(this.state.length === this.props.time){
            this.setState({ interval: clearInterval(this.state.interval), length: 1 });
            this.socket.emit('timer_finished', this.props.tempID);
        }
    }

    render(){
        return(
            <div>
                <p>{10 - this.state.length}</p>
            </div>
        );
    }
}

export default Timer;
