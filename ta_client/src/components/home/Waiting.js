import React from 'react';
import Timer from './Timer.js';

class Waiting extends Component {
    constructor(){
        super();
        this.state = {
            //idk what this needs in its state ngl
            //really just a shell for timer to live through
            //so I can use timer elsewhere without needing 
            //to render everything within timer's file
        }

    }

    render(){

        return(
            <div className="waiting">
                <p className="w-announcment">Loading, this'll only take a moment</p>
                <Timer time={10} tempID={this.props.tempID}/>
            </div>
        )
    }
}
