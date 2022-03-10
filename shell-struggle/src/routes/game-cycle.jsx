// gameCycle.jsx

import React from 'react';
import { db } from '../firebase';
import { off, ref, onValue, set, remove } from "firebase/database"; 
import { getUserProfile } from '../database';
import Turtle from '../turtle';
import { getTurtleClasses } from '../database';

// For later use in observers
var messageRef;
var nextMoveRef;
var redIsNextRef;
var redHealthRef;
var blueHealthRef;
var redTurtleRef;
var blueTurtleRef;

// Basic Setters
function setRedIsNext(bool) { set(redIsNextRef, bool); }
function setNextMove(move) { set(nextMoveRef, move); }
function setMessage(message) { set(messageRef, message); }
function setRedHealth(health) { set(redHealthRef, health); }
function setBlueHealth(health) { set(blueHealthRef, health); }
function setRedTurtle(class_name) { set(redTurtleRef, class_name); }
function setBlueTurtle(class_name) { set(blueTurtleRef, class_name); }

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
            image={props.image}
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
            redTurtle: null,
            blueTurtle: null,
            room_id: null,
            turtleClasses: null
        };
    };

    playerColor = this.props.playerColor;
    opponentColor = this.props.opponentColor;

    // Track message, nextMove, and redIsNext in the realtime database
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

        onValue(redTurtleRef, (snapshot) => {
            let redTurtle = snapshot.val();
            this.setState({redTurtle: redTurtle});
        });

        onValue(blueTurtleRef, (snapshot) => {
            let blueTurtle = snapshot.val();
            this.setState({blueTurtle: blueTurtle});
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
        off(redTurtleRef);
        off(blueTurtleRef);
        remove(db, this.props.room_id);
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

    classToIndex(class_name) {
        const turtleClasses = ["Builder", "Chef", "Cupid", "Mewtwo",
        "Robot", "Standard", "Tank", "Wizard"];
        for (let i = 0; i < 8; ++i) {
            if (turtleClasses[i] === class_name)
                return i;
        }
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

        let playerHealth;
        let opponentHealth;
        if (this.playerColor === "Red") {
            playerHealth = this.state.redHealth;
            opponentHealth = this.state.blueHealth;
        } else {
            playerHealth = this.state.blueHealth;
            opponentHealth = this.state.redHealth; 
        }
        if (this.state.redTurtle === null || this.state.blueTurtle === null)
            return(<div>Loading ... </div>);

        const turtles = this.state.turtleClasses;
        const rTurt = this.classToIndex(this.state.redTurtle);
        const bTurt = this.classToIndex(this.state.blueTurtle);
        
        const rSTR = turtles[rTurt].strength;
        const rINT = turtles[rTurt].intelligence;
        const rIMG = turtles[rTurt].image;

        const bSTR = turtles[bTurt].strength;
        const bINT = turtles[bTurt].intelligence;
        const bIMG = turtles[bTurt].image;

        if (this.playerColor === "Red") {
            return (
            <div>
                <h1>Shell Struggle EXTREME</h1>
                <h2>Room: { this.state.room_id }</h2>
                <Player 
                    user="Sample Opponent" 
                    playerColor={"Blue"}
                    health={opponentHealth}
                    strength={bSTR}
                    intelligence={bINT}
                    image={bIMG}
                    >
                </Player>
                <Player
                    user="Sample Player"
                    playerColor={"Red"}
                    health={playerHealth}
                    strength={rSTR}
                    intelligence={rINT}
                    image={rIMG}>
                </Player>
                <div>{this.state.message}</div>
                {turn}
                {options}
            </div>
            );
        } else {
            return (
                <div>
                    <h1>Shell Struggle EXTREME</h1>
                    <h2>Room: { this.state.room_id }</h2>
                    <Player 
                        user="Sample Opponent" 
                        playerColor={"Red"}
                        health={opponentHealth}strength={rSTR}
                        intelligence={rINT}
                        image={rIMG}
                        >
                    </Player>
                    <Player
                        user="Sample Player"
                        playerColor={"Blue"}
                        health={playerHealth}
                        strength={bSTR}
                        intelligence={bINT}
                        image={bIMG}>
                    </Player>
                    <div>{this.state.message}</div>
                    {turn}
                    {options}
                </div>
                );
        }
    }
};

export default GameCycle;