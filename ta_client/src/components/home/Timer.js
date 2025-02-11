import React from 'react';

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
        this.setInteveral(this.props.time); //work in progress
    }

    componentWillUnmount(){

    }
}