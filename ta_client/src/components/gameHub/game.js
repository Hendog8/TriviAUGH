import React, { Component, useState } from 'react';
import io from 'socket.io-client';
//import { connect } from 'react-redux'; what is redux?????


class Game extends Component {
    constructor(){
        super();
        this.state = {
            gamers: [], //array of player objects
                        //includes name, score, and an array of answers for the current question
            questions: [], //array of question objects 
                           //each includes question, correct, and incorrect answers
            questionNum: 0, //index of current question

            timer: 10, //time in seconds per question
                       //should stay short, don't gotta be 10 tho
        }
    }

    componentDidMount(){
        this.importQuestions();
    }

    importQuestions(){
        imported = [{"What?", ["who", "how"], ["where", "why"]}]
        this.setState({
            questions: {"huh"},
        })
    }
}
class Question extends Component {
    constructor(){
        super();
        this.state = {
            query: "", //the question
            correct: [], //array of correct answers, 0-4 possible
            incorrect: [], //same for incorrect, the two should add to 4 answers total
        }
    }
}
