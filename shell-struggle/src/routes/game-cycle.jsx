// gameCycle.jsx

import React from 'react';
import { db } from '../firebase';
import { off, ref, onValue, set } from "firebase/database"; 
import Turtle from '../turtle';

const roomID = 'room'

var messageRef = ref(db, roomID + '/message');
var nextMoveRef = ref(db, roomID + '/nextMove');
var redIsNextRef = ref(db, roomID + '/redIsNext');

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
            message: "none",
            nextMove: "none",
            redIsNext: true,
            playerHealth: 30,
            opponentHealth: 30
        };
    };

    playerColor = this.props.playerColor;
    opponentColor = this.props.opponentColor;

    // Track message, nextMove, and redIsNext in the realtime database
    componentDidMount() {
        onValue(messageRef, (snapshot) => {
            let message = snapshot.val();
            this.setState({message: message});
        });

        // Process new move
        onValue(nextMoveRef, (snapshot) => {
            let nextMove = snapshot.val();
            console.log(nextMove);
            this.setState({nextMove: nextMove});
        });

        onValue(redIsNextRef, (snapshot) => {
            let redIsNext = snapshot.val();
            this.setState({redIsNext: redIsNext});
        });
    }

    // Stop tracking
    componentWillUnmount() {
        off(messageRef);
        off(nextMoveRef);
        off(redIsNextRef);
    }

    endTurn() {
        setRedIsNext(!this.state.redIsNext);
        return;
    }

    render() {
        const nextPlayer = this.state.redIsNext ? "Red" : "Blue";

        let options = <div></div>;
        if (nextPlayer === this.playerColor) {
            options = <div>
                <AttackButton attack="Bite" />
                <AttackButton attack="Shell Bash" />
                <AttackButton attack="Dive" />
            </div>
        }

        return (
        <div>
            <h1>Shell Struggle EXTREME</h1>
            <Player 
                user="Sample Opponent" 
                playerColor={this.opponentColor}
                health={this.state.opponentHealth}>
            </Player>
            <Player
                user="Sample Player"
                playerColor={this.playerColor}
                health={this.state.playerHealth}>
            </Player>
            <div>{this.state.message}</div>
            <div>It is currently the {nextPlayer} Player's Turn:</div>
            {options}
        </div>
    );}
};

export default GameCycle;