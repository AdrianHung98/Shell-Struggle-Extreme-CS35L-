// gameCycle.jsx

import React from 'react';
import { db } from '../firebase';
import { off, ref, onValue, set } from "firebase/database"; 
import { getUserProfile } from '../database';
import Turtle from '../turtle';
import { getTurtles } from '../database';

// For later use in observers
var messageRef;
var nextMoveRef;
var redIsNextRef;
var redHealthRef;
var blueHealthRef;

// Basic Setters
function setRedIsNext(bool) { set(redIsNextRef, bool); }
function setNextMove(move) { set(nextMoveRef, move); }
function setMessage(message) { set(messageRef, message); }
function setRedHealth(health) { set(redHealthRef, health); }
function setBlueHealth(health) { set(blueHealthRef, health); }

function AttackButton(props) {
    return(
        <button className="attack" onClick={() => { setNextMove(props.attack);}}>
            {props.attack}
        </button>
);}

function Player(props) {
    return(
        <div>
            <Turtle 
            image="https://blog.emojipedia.org/content/images/2020/07/android-11-turtle-emoji.jpg"
            health={props.health} intelligence={props.intelligence} strength={props.strength}>
            </Turtle>
            <div>Player: {props.user} ({props.playerColor})</div>
        </div>
);}

class GameCycle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            nextMove: "none",
            redIsNext: true,
            redHealth: 30,
            blueHealth: 30,
            playerTurtles: null,
            opponentTurtles: null,
            room_id: null
        };
    };

    playerColor = this.props.playerColor;
    opponentColor = this.props.opponentColor;

    // Track message, nextMove, and redIsNext in the realtime database
    async componentDidMount() {
        // Get player Turtles
        const playerTurtles = await getTurtles(this.props.uid);
        this.setState({playerTurtles: playerTurtles});
        console.log(playerTurtles);
        //const opponentTurtles = await getTurtles(this.props.opuid);
        //this.setState({opponentTurtles: opponentTurtles});

        // Get shared room ID
        const room_id = (await getUserProfile(this.props.uid)).in_room;
        console.log(room_id);
        this.setState({ room_id: room_id });

        messageRef = ref(db, room_id + '/message');
        nextMoveRef = ref(db, room_id + '/nextMove');
        redIsNextRef = ref(db, room_id + '/redIsNext');
        redHealthRef = ref(db, room_id + '/redHealth');
        blueHealthRef = ref(db, room_id + '/blueHealth');

        onValue(nextMoveRef, (snapshot) => {
            this.processMove(snapshot);   
        });

        onValue(messageRef, (snapshot) => {
            let message = snapshot.val();
            this.setState({message: message});
        });

        onValue(redIsNextRef, (snapshot) => {
            let redIsNext = snapshot.val();
            this.setState({redIsNext: redIsNext});
        });

        onValue(redHealthRef, (snapshot) => {
            let redHealth = snapshot.val();
            this.setState({redHealth: redHealth});
        });

        onValue(blueHealthRef, (snapshot) => {
            let blueHealth = snapshot.val();
            this.setState({blueHealth: blueHealth});
        });

        setRedHealth(30);
        setBlueHealth(30);
        setNextMove("none");
        setMessage("");
    }

    // Stop tracking
    componentWillUnmount() {
        off(messageRef);
        off(nextMoveRef);
        off(redIsNextRef);
        off(redHealthRef);
        off(blueHealthRef);
    }

    processMove(snapshot) {
        let nextMove = snapshot.val();
        this.setState({nextMove: nextMove});
        if (nextMove === "none")
            return;

        const nextPlayer = this.state.redIsNext ? "Red" : "Blue";
        if (nextPlayer === "Red") {
            let health = this.state.blueHealth - 10;
            if (health <= 0) {
                health = 0; setMessage("Red Player Won!");
            }
            setBlueHealth(health);
        } else {
            let health = this.state.redHealth - 10;
            if (health <= 0) {
                health = 0; setMessage("Blue Player Won!");
            }
            setRedHealth(health);
        }
        if (nextPlayer === this.playerColor) {
            this.endTurn();
        }
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
        const pTurt = this.state.playerTurtles;
        const oTurt = this.state.opponentTurtles;
        if (pTurt === null) //|| oTurt === null)
            return(<div>Loading ... </div>);
        return (
        <div>
            <h1>Shell Struggle EXTREME</h1>
            <h2>Room: { this.state.room_id }</h2>
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