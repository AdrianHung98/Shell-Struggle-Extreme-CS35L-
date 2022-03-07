// gameCycle.jsx

import React from 'react';
import { db } from '../firebase';
import { off, ref, onValue } from "firebase/database"; 

var messageRef = ref(db, 'room/message');
var currentMoveRef = ref(db, 'room/currentMove');
var redIsNextRef = ref(db, 'room/redIsNext');

function Player(props) {
    return(
        <div>Player: {props.user} ({props.playerColor})</div>
    );
}

class GameCycle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "none",
            currentMove: "none",
            redIsNext: true,
        };
    };

    componentDidMount() {
        onValue(messageRef, (snapshot) => {
            let message = snapshot.val();
            this.setState({message: message});
        });

        onValue(currentMoveRef, (snapshot) => {
            let currentMove = snapshot.val();
            this.setState({currentMove: currentMove});
        });

        onValue(redIsNextRef, (snapshot) => {
            let redIsNext = snapshot.val();
            this.setState({redIsNext: redIsNext});
        });
    }

    componentWillUnmount() {
        off(messageRef);
        off(currentMoveRef);
        off(redIsNextRef);
    }

    render() {
        const nextPlayer = this.state.redIsNext ? "Red" : "Blue";
        return (
        <div>
            <h1>Shell Struggle EXTREME</h1>
            <Player user="Sample Player" playerColor="Red"></Player>
            <Player user="Sample Opponent" playerColor="Blue"></Player>
            <div>{this.state.message}</div>
        </div>
    );}
};

export default GameCycle;