// gameCycle.jsx

import React from 'react';
import Turtle from '../turtle';
import '../turtle.css';


function AttackButton(props) {
    return(
        <button className="attack" onClick={props.onClick}>
            {props.attack}
        </button>
    );
}

class GameCycle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Red player fights blue player
            // Keep track of whose turn it is
            redIsNext: true,
            turnNumber: 0,
            pauseFrames: 0,
            message: null,
            opponentHealth: 50,
            playerHealth: 50,
        }
    };

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

    handleClick(playerColor) {
        this.setState({
            redIsNext: !this.state.redIsNext,
            turnNumber: this.state.turnNumber + 1,
            pauseFrames: 3,
            opponentHealth: this.state.opponentHealth - 10,
            message: playerColor + " Player attacked for 10 damage!"
        });
        if (this.state.opponentHealth < 0) {
            this.setState({opponentHealth: 0});
        }
    }

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
            this.setState({
                pauseFrames: this.state.pauseFrames - 1,
            });
        }
        if (this.state.pauseFrames === 0) {
            if (this.state.message) {
                this.setState({message: null, pauseFrames: 1});
            }
        }
        let playerColor = this.props.playerColor;
        let nextPlayer = this.state.redIsNext ? "Red" : "Blue";
        let won = false;
        if (this.state.opponentHealth <= 0 || this.state.playerHealth <= 0) {
            won = true;
        }

        // Computer Opponent
        if (this.state.pauseFrames === 0 && nextPlayer !== playerColor && !won) {
            this.setState({
                redIsNext: !this.state.redIsNext,
                turnNumber: this.state.turnNumber + 1,
                pauseFrames: 3,
                playerHealth: this.state.playerHealth - 5,
                message: nextPlayer + " Player attacked for 5 damage!"
            });
            if (this.state.playerHealth < 0) {
                this.setState({opponentHealth: 0});
            }     
        }
    }

    render() {
        const nextPlayer = this.state.redIsNext ? "Red" : "Blue";
        const playerColor = this.props.playerColor;
        let opponentColor = this.props.opponentColor;

        let winMessage = <div></div>
        let won = false;
        if (this.state.opponentHealth <= 0) {
            winMessage = `${playerColor} Player Won!`;
            won = true;
        }
        if (this.state.playerHealth <= 0) {
            winMessage = `${opponentColor} Player Won!`;
            won = true;
        }

        let status = "";
        if (this.state.message) {
            status = this.state.message;
        } else {
            if (won) {
                status = "";
            } else {
                status = `It is the ${nextPlayer} Player's Turn`;
            }
        }

        let options = <div></div>;
        if (!won && this.state.pauseFrames === 0) {
            let clickFunction = () => {return};
            if (playerColor === nextPlayer) {
                clickFunction = () => this.handleClick(nextPlayer);
            }
            options = <div>
                <AttackButton attack="Bite" onClick={clickFunction} />
                <AttackButton attack="Shell Bash" onClick={clickFunction} />
                <AttackButton attack="Dive" onClick={clickFunction} />
            </div>
        }

        return (
            <div>
                <h1>Shell Struggle EXTREME</h1>
                <div className='player' >
                    {this.opponentTurtle}
                    Enemy Turtle!!<br/>
                    Health: {this.state.opponentHealth}
                </div>
                <div className='player'>
                    {this.playerTurtle}
                    Your turtle champion!<br/>
                    Health: {this.state.playerHealth}
                </div>
                <div>
                    <div>{status}</div>
                    <div>{winMessage}</div>
                    {options}
                </div>
            </div>
        );
    }
}

export default GameCycle