// gameCycle.jsx

import React from 'react';
import Turtle from '../turtle';
import '../turtle.css';


class GameCycle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Red player fights blue player
            // Keep track of whose turn it is
            redIsNext: true,
            turnNumber: 0,
            pauseFrames: 0
        }
    };
    opponentHealth = 50;
    playerHealth = 50;

    playerTurtle = <Turtle
        class='standard' 
        attack_stat='10'
        wisdom_stat='10'
        speed_stat='10'
        image="https://blog.emojipedia.org/content/images/2020/07/android-11-turtle-emoji.jpg"
        />

    opponentTurtle =<Turtle 
        class='scientist' 
        attack_stat='5'
        wisdom_stat='20'
        speed_stat='5'
        image='https://cdn.drawception.com/images/panels/2017/5-8/SSFCdOc9BN-2.png'
      />

    componentDidMount() {
        this.timerID = setInterval(
          () => this.tick(),
          1000
        );
    }
    
    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        if (this.state.pauseFrames > 0) {
            this.setState({pauseFrames: this.state.pauseFrames - 1});
        }
      }

    render() {
        const nextPlayer = this.state.redIsNext ? "Red" : "Blue";

        return (
            <div>
                <h1>Shell Struggle EXTREME</h1>
                <div className='player' >
                    {this.opponentTurtle}
                    Enemy Turtle!!<br/>
                    Health: {this.opponentHealth}
                </div>
                <div className='player'>
                    {this.playerTurtle}
                    Your turtle champion!<br/>
                    Health: {this.playerHealth}
                </div>
                <div>
                    It is the {nextPlayer} Player's Turn:
                </div>
            </div>
        );
    }
}

export default GameCycle