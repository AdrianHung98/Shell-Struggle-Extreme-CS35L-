// gameCycle.jsx

import React from 'react';
import { db } from '../firebase';
import { off, ref, onValue, set, remove } from "firebase/database"; 
import { getUserProfile } from '../database';
import Turtle from '../turtle';
import { getTurtleClasses } from '../database';
import './game-cycle.css';

// Reference Arrays
const turtleClasses = ["Builder", "Chef", "Cupid", "Mewtwo", "Robot", "Standard", "Tank", "Wizard"];
const moves = ["Shell Slam", "Quick Snap", "Show off a Cool Stick"];

// For later use in observers
var messageRef;
var movesRef;
var redMoveRef;
var blueMoveRef;
var redHealthRef;
var blueHealthRef;
var redTurtleRef;
var blueTurtleRef;

// Basic Setters
function setRedMove(move) { set(redMoveRef, move); }
function setBlueMove(move) { set(blueMoveRef, move); }
function setMessage(message) { set(messageRef, message); }
function setRedHealth(health) { set(redHealthRef, health); }
function setBlueHealth(health) { set(blueHealthRef, health); }
function setRedTurtle(class_name) { set(redTurtleRef, class_name); }
function setBlueTurtle(class_name) { set(blueTurtleRef, class_name); }

function AttackButton(props) {
    return(
        <button className="attack" onClick={props.handleClick}>
            {props.attack}
        </button>
);}

function Player(props) {
    return(
        <div className="PlayerCard">
            <div>Player: {props.user} ({props.playerColor})</div>
            <Turtle image={props.image}
            health={props.health} intelligence={props.intelligence} strength={props.strength}>
            </Turtle>
            
        </div>
);}

class GameCycle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: null,
            redMove: null,
            blueMove: null,
            redHealth: 100,
            blueHealth: 100,
            redTurtle: null,
            blueTurtle: null,
            room_id: null,
            turtleClasses: null,
            hasChosen: false
        };
    };

    playerColor = this.props.playerColor;
    opponentColor = this.props.opponentColor;

    // Track message, moves, and redIsNext in the realtime database
    async componentDidMount() {
        // Get shared room ID
        const room_id = (await getUserProfile(this.props.uid)).in_room;
        this.setState({ room_id: room_id });

        redTurtleRef = ref(db, room_id + '/redTurtle');
        blueTurtleRef = ref(db, room_id + '/blueTurtle');
        // Get Player turtles
        const playerTurtle = (await getUserProfile(this.props.uid)).using;
        if (this.props.playerColor === "Red")
            setRedTurtle(playerTurtle);
        else
            setBlueTurtle(playerTurtle);

        // Get entire turtle class
        const turtleClasses = await getTurtleClasses();
        this.setState({turtleClasses: turtleClasses});

        messageRef = ref(db, room_id + '/message');
        movesRef = ref(db, room_id + '/moves');
        redMoveRef = ref(db, room_id + '/moves/red');
        blueMoveRef = ref(db, room_id + '/moves/blue');
        redHealthRef = ref(db, room_id + '/redHealth');
        blueHealthRef = ref(db, room_id + '/blueHealth');

        onValue(movesRef, (snapshot) => {
            this.processMoves(snapshot);
            console.log(snapshot.val);   
        });

        onValue(messageRef, (snapshot) => {
            let message = snapshot.val();
            this.setState({message: message});
        });

        onValue(redHealthRef, (snapshot) => {
            let redHealth = snapshot.val();
            this.setState({redHealth: redHealth});
        });

        onValue(blueHealthRef, (snapshot) => {
            let blueHealth = snapshot.val();
            this.setState({blueHealth: blueHealth});
        });

        const turtles = this.state.turtleClasses;
        onValue(redTurtleRef, (snapshot) => {
            let redTurtle = snapshot.val();
            this.setState({redTurtle: redTurtle});

            const rTurt = this.classToIndex(this.state.redTurtle);
            setRedHealth(150 + (5 * turtles[rTurt].health));
        });

        onValue(blueTurtleRef, (snapshot) => {
            let blueTurtle = snapshot.val();
            this.setState({blueTurtle: blueTurtle});

            const bTurt = this.classToIndex(this.state.blueTurtle);
            setBlueHealth(150 + (5 * turtles[bTurt].health));
        });
    }

    // Stop tracking
    componentWillUnmount() {
        off(messageRef);
        off(movesRef);
        off(redHealthRef);
        off(blueHealthRef);
        off(redTurtleRef);
        off(blueTurtleRef);
        remove(ref(db, this.props.room_id));
    }

    chooseMove(move) {
        if (this.playerColor === "Red")
            setRedMove(move);
        else
            setBlueMove(move);
        this.setState({hasChosen: true});
        console.log("Chose", moves[move]);
    }

    processMoves(snapshot) {
        console.log("Process Move", snapshot.val());
    }

    endTurn() {
        console.log("End Turn");
    }

    classToIndex(class_name) {
        for (let i = 0; i < 8; ++i) {
            if (turtleClasses[i] === class_name)
                return i;
        }
    }

    render() {
        // Health Display
        let playerHealth;
        let opponentHealth;
        if (this.props.playerColor === "Red") {
            playerHealth = this.state.redHealth; opponentHealth = this.state.blueHealth;
        } else {
            playerHealth = this.state.blueHealth; opponentHealth = this.state.redHealth;
        }

        // Turtle Stats
        if (this.state.redTurtle === null || this.state.blueTurtle === null)
            return(<div>Loading ... </div>);
        const turtles = this.state.turtleClasses;
        console.log(turtles);
        const rTurt = this.classToIndex(this.state.redTurtle);
        const bTurt = this.classToIndex(this.state.blueTurtle);        
        const rSTR = turtles[rTurt].strength; const rINT = turtles[rTurt].intelligence;
        const rIMG = turtles[rTurt].image; // const rHP = turtles[rTurt].health;
        const bSTR = turtles[bTurt].strength; const bINT = turtles[bTurt].intelligence;
        const bIMG = turtles[bTurt].image; // const bHP = turtles[bTurt].health;

        // Player Display
        let playerDisplay;
        if (this.playerColor === "Red") {
            playerDisplay =
            <div>
                <Player 
                    user="Sample Opponent" playerColor={"Blue"}
                    health={opponentHealth} // maxHealth={bHP}
                    strength={bSTR} intelligence={bINT} image={bIMG}>
                </Player>
                <Player
                    user="Sample Player" playerColor={"Red"}
                    health={playerHealth} // maxHealth={rHP}
                    strength={rSTR} intelligence={rINT} image={rIMG}>
                </Player>
            </div>;
        } else {
            playerDisplay =
                <div>
                    <Player 
                        user="Sample Opponent" playerColor={"Red"}
                        health={opponentHealth} // maxHealth={rHP} 
                        strength={rSTR} intelligence={rINT} image={rIMG}
                        >
                    </Player>
                    <Player
                        user="Sample Player" playerColor={"Blue"}
                        health={playerHealth} // maxHealth={bHP}
                        strength={bSTR} intelligence={bINT} image={bIMG}>
                    </Player>
                </div>;
        }

        // Move Selection
        let options;
        if (this.state.hasChosen)
            options = <div></div>
        else {
            options = 
            <div>
                <AttackButton attack="Shell Slam" handleClick={() => this.chooseMove(0)}/><br/>
                <AttackButton attack="Quick Snap" handleClick={() => this.chooseMove(1)}/><br/>
                <AttackButton attack="Show off a Cool Stick" handleClick={() => this.chooseMove(2)}/>
            </div>
        }

        return (
            <div>
                <h1>Shell Struggle EXTREME</h1>
                {playerDisplay}
                Select a move:
                {options}
            </div>
        );
    }
};

export default GameCycle;