// gameCycle.jsx

import React from 'react';
import { db } from '../firebase';
import { off, ref, onValue, set } from "firebase/database"; 
import Turtle from '../turtle';

const roomID = 'room'

var messageRef = ref(db, roomID + '/message');
var nextMoveRef = ref(db, roomID + '/nextMove');
var redIsNextRef = ref(db, roomID + '/redIsNext');
var redHealthRef = ref(db, roomID + '/redHealth');
var blueHealthRef = ref(db, roomID + '/blueHealth');

function setRedIsNext(bool) {
    set(redIsNextRef, {
        redIsNext: bool
    });
}

function setNextMove(move) {
    set(nextMoveRef, {
        nextMove: move
    });
}

function setMessage(message) {
    set(messageRef, {
        message: message     
    });
}

function setRedHealth(health) {
    set(redHealthRef, {
        redHealth: health
    });
}

function setBlueHealth(health) {
    set(blueHealthRef, {
        blueHealth: health
    });
}

function AttackButton(props) {
    return(
        <button 
            className="attack" 
            onClick={() => {
                setNextMove(props.attack);
            }}>
                {props.attack}
        </button>
    );
}

function Player(props) {
    return(
        <div>
            <Turtle 
            image="https://blog.emojipedia.org/content/images/2020/07/android-11-turtle-emoji.jpg"
            health={props.health}
            intelligence="10"
            strength="10"
            >
            </Turtle>
            <div>Player: {props.user} ({props.playerColor})</div>
        </div>
    );
}

class GameCycle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            nextMove: "none",
            redIsNext: true,
            redHealth: 30,
            blueHealth: 30,
        };
        setRedHealth(30);
        setBlueHealth(30);
        setNextMove("none");
        setMessage("");
    };

    playerColor = this.props.playerColor;
    opponentColor = this.props.opponentColor;

    // Track message, nextMove, and redIsNext in the realtime database
    componentDidMount() {
        onValue(messageRef, (snapshot) => {
            let message = snapshot.val().message;
            this.setState({message: message});
        });

        // Process new move
        onValue(nextMoveRef, (snapshot) => {
            let nextMove = (snapshot.val()).nextMove;
            this.setState({nextMove: nextMove});
            if (nextMove === "none") {
                return;
            }
            const nextPlayer = this.state.redIsNext ? "Red" : "Blue";
            if (nextPlayer === "Red") {
                let health = this.state.blueHealth - 10;
                if (health <= 0) {
                    health = 0;
                    setMessage("Red Player Won!");
                }
                setBlueHealth(health);
            } else {
                let health = this.state.redHealth - 10;
                if (health <= 0) {
                    health = 0;
                    setMessage("Blue Player Won!");
                }
                setRedHealth(health);
            }
            if (nextPlayer === this.playerColor) {
                this.endTurn();
            }
        });

        onValue(redIsNextRef, (snapshot) => {
            let redIsNext = snapshot.val().redIsNext;
            this.setState({redIsNext: redIsNext});
        });

        onValue(redHealthRef, (snapshot) => {
            let redHealth = snapshot.val().redHealth;
            this.setState({redHealth: redHealth});
        });

        onValue(blueHealthRef, (snapshot) => {
            let blueHealth = snapshot.val().blueHealth;
            this.setState({blueHealth: blueHealth});
        });
    }

    // Stop tracking
    componentWillUnmount() {
        off(messageRef);
        off(nextMoveRef);
        off(redIsNextRef);
        off(redHealthRef);
        off(blueHealthRef);
    }

    endTurn() {
        setRedIsNext(!this.state.redIsNext);
        return;
    }

    render() {
        const nextPlayer = this.state.redIsNext ? "Red" : "Blue";
        let turn = <div>It is the {nextPlayer} Player's Turn:</div>;
        let redWon = false;
        let blueWon = false;
        if (this.state.redHealth <= 0) {
            blueWon = true;
            turn = <div></div>
        }
        if (this.state.opponentHealth <= 0) {
            redWon = true;
            turn = <div></div>
        }

        let options = <div></div>;
        if (nextPlayer === this.playerColor && !redWon && !blueWon) {
            options = <div>
                <AttackButton attack="Bite" />
                <AttackButton attack="Shell Bash" />
                <AttackButton attack="Dive" />
            </div>
        }

        let playerHealth = 0;
        let opponentHealth = 0;
        if (this.playerColor === "Red") {
            playerHealth = this.state.redHealth;
            opponentHealth = this.state.blueHealth;
        } else {
            playerHealth = this.state.blueHealth;
            opponentHealth = this.state.redHealth; 
        }

        return (
        <div>
            <h1>Shell Struggle EXTREME</h1>
            <Player 
                user="Sample Opponent" 
                playerColor={this.opponentColor}
                health={opponentHealth}>
            </Player>
            <Player
                user="Sample Player"
                playerColor={this.playerColor}
                health={playerHealth}>
            </Player>
            <div>{this.state.message}</div>
            {turn}
            {options}
        </div>
    );}
};

export default GameCycle;