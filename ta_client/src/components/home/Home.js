import React, { Component } from 'react';
import io from 'socket.io-client';

class Home extends Component{
    constructor(){
        super();
        this.state = {
            //not sure if I actually need much of a state here
        }

        //All this component has to do is redirect player to be players
        //and the host to be the host

        //must pass along proper info

        //must accept a password (host) and nickname (player)

        //"GO!" button that emits whatever depending on whether or not the password is there (whether host or nah)
    }
}

export default Home;
