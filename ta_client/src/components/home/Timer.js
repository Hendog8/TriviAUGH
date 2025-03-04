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
            this.setState(prevState => ({ length: prevState.length + .5 }));
        }, 500);
    }

    componentWillUnmount(){
        this.setState({ interval: clearInterval(this.state.interval) });
    }

    componentDidUpdate(){
        if(this.state.length === this.props.time){
            this.setState({ interval: clearInterval(this.state.interval), length: 1 });
            if(this.props.type === 'waiting'){
                this.socket.emit('timer_finished', this.props.tempID);
            } else if(this.props.type === 'question'){
                this.socket.emit('timer_finished', this.props.tempID);//'all');
            }
        }
    }

    render(){
        return(
            <div>
                <p>{this.props.time - this.state.length}</p>
            </div>
        );
    }
}

export default Timer;
