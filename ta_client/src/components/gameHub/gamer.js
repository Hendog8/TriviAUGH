import React, { Component } from 'react';
import io from 'socket.io-client';

class Gamer extends Component {
    constructor(){
        super();
        this.state = {
            nickname: '',
            score: '',
            selectedAnswers: [],

        }
    }

    componentDidMount(){
        this.socket = io('/');
        this.socket.emit()
    }
}