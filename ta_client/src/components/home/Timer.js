import React from 'react';
import io from 'socket.io-client';

class Timer extends Component{
    constructor(props){
        super(props);
        this.state = {
            length: this.props.time,
                   //maybe this works? unsure about props within constructors
            interval: null,
        }
    }

    componentDidMount(){
        this.socket = io.connect('http://localhost:4000');
        this.setState({ interval: setInteveral(() => {
            this.setState({ length: this.state.length - 0.1 });
        }, 100) });
    }

    componentWillUnmount(){
        this.setState({ interval: clearInterval(this.state.interval) });
    }

    componentDidUpdate(){
        if(this.state.length <= 0){
            this.setState({ interval: clearInterval(this.state.interval) });
            this.socket.emit('timer_finished', this.props.tempID);
        }
    }

    render(){
        return(
            <div>
                <p>{this.state.length}</p>
            </div>
        );
    }
}
