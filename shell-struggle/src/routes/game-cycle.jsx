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
const moves = ["", "Shell Slam", "Quick Snap", "Show off a Cool Stick"];
const speeds = [0, 7, 15, 9];

// For later use in observers
var messageRef;
var movesRef;
var redMoveRef;
var blueMoveRef;
var redHealthRef;
var blueHealthRef;
var redTurtleRef;
var blueTurtleRef;
var completedRef;
var redCompletedRef;
var blueCompletedRef;

// Basic Setters
function setRedMove(move) { set(redMoveRef, move); }
function setBlueMove(move) { set(blueMoveRef, move); }
function setMessage(message) { set(messageRef, message); }
function setRedHealth(health) { set(redHealthRef, health); }
function setBlueHealth(health) { set(blueHealthRef, health); }
function setRedTurtle(class_name) { set(redTurtleRef, class_name); }
function setBlueTurtle(class_name) { set(blueTurtleRef, class_name); }
function setRedCompleted(bool) { set(redCompletedRef, bool); }
function setBlueCompleted(bool) { set(blueCompletedRef, bool); }

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
            redMove: "red",
            blueMove: "blue",
            redHealth: 100,
            blueHealth: 100,
            redTurtle: null,
            blueTurtle: null,
            room_id: null,
            turtleClasses: null,
            hasChosen: false,
            completed: false
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
        completedRef = ref(db, room_id + '/completed');
        redCompletedRef = ref(db, room_id + '/completed/red');
        blueCompletedRef = ref(db, room_id + '/completed/blue');

        setRedMove(0);
        setBlueMove(0);

        onValue(movesRef, (snapshot) => {
            console.log("Snapshot", snapshot.val());
            this.setState({blueMove: snapshot.val().blue});
            this.setState({redMove: snapshot.val().red});
            this.handleMoveUpdate(snapshot);  
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

        setBlueCompleted(false);
        setRedCompleted(false);
        onValue(completedRef, (snapshot) => {
            let completed = snapshot.val();
            if (completed.red && completed.blue) {
                setBlueCompleted(false);
                setRedCompleted(false);
                this.setState({completed: false});
                this.setState({hasChosen: false});

                if (this.playerColor === "Red") {
                    this.processMoves();
                } else {return;}
                
                console.log("Got here???/");

                setRedMove(0);
                setBlueMove(0);
            }
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
        // remove(ref(db, this.props.room_id));
    }

    chooseMove(move) {
        if (this.playerColor === "Red")
            setRedMove(move);
        else
            setBlueMove(move);
        this.setState({hasChosen: true});
    }

    handleMoveUpdate(snapshot) {
        const movesObject = snapshot.val();
        try {
            if (this.state.completed)
                return;
            if (movesObject.blue && movesObject.red) {
                if (this.playerColor === "Red")
                    setRedCompleted(true);
                else
                    setBlueCompleted(true);
            } else { return; }
        } catch { return; }
        this.setState({hasChosen: false});
        this.setState({completed: true});
    }

    translateMoveToDamage(move) {
        let damage;
        console.log("move:", move);
        switch(move) {
            case 1: damage = 70; break;
            case 2: damage = 30; break;
            case 3: damage = Math.floor(Math.random() * (100 - 1) + 1); break; 
        }
        return damage;
    }

    attackRedPlayer(strength) {
        console.log(this.state.blueMove);
        let damage = this.translateMoveToDamage(this.state.blueMove);
        damage = damage + Math.floor(damage * (strength / 30));
        let newHealth = this.state.redHealth - damage;
        if (newHealth < 0)
            newHealth = 0;
        setRedHealth(newHealth);
        this.setState({redHealth: newHealth});
    }

    attackBluePlayer(strength) {
        let damage = this.translateMoveToDamage(this.state.redMove);
        damage = Math.floor(damage * (strength / 30));
        let newHealth = this.state.blueHealth - damage;
        if (newHealth < 0)
            newHealth = 0;
        setBlueHealth(newHealth);
        this.setState({blueHealth: newHealth});
    }


    processMoves() {
        const turtles = this.state.turtleClasses;
        const rTurt = this.classToIndex(this.state.redTurtle);
        const bTurt = this.classToIndex(this.state.blueTurtle);
        const rINT = turtles[rTurt].intelligence; const rSTR = turtles[rTurt].strength;
        const bINT = turtles[bTurt].intelligence; const bSTR = turtles[bTurt].strength;

        const redMove = this.state.redMove;
        const blueMove = this.state.blueMove;

        let firstMove;
        let secondMove;
        if (speeds[redMove] + rINT == speeds[blueMove] + bINT) {
            let coin = Math.floor(Math.random());
            if (coin) {
                firstMove = this.attackRedPlayer;
                secondMove = this.attackBluePlayer;
            }
        } else {
            if (speeds[redMove] + rINT > speeds[blueMove] + bINT) {
                firstMove = () => {this.attackBluePlayer(rSTR)};
                secondMove = () => {this.attackRedPlayer(bSTR)};
            } else {
                firstMove = () => {this.attackRedPlayer(bSTR)};
                secondMove = () => {this.attackBluePlayer(rSTR)};
            }
        }
        firstMove();
        if (this.state.redHealth <= 0) {
            console.log("Blue Player Won");
            return;
        }
        if  (this.state.blueHealth <= 0) {
            console.log("Red Player Won");
        }

        secondMove();
        if (this.state.redHealth <= 0) {
            console.log("Blue Player Won");
            return;
        }
        if  (this.state.blueHealth <= 0) {
            console.log("Red Player Won");
        }

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
        const rTurt = this.classToIndex(this.state.redTurtle);
        const bTurt = this.classToIndex(this.state.blueTurtle);        
        const rSTR = turtles[rTurt].strength; const rINT = turtles[rTurt].intelligence;
        const rIMG = turtles[rTurt].image; const rHP = turtles[rTurt].health;
        const bSTR = turtles[bTurt].strength; const bINT = turtles[bTurt].intelligence;
        const bIMG = turtles[bTurt].image; const bHP = turtles[bTurt].health;

        // Player Display
        let playerDisplay;
        if (this.playerColor === "Red") {
            playerDisplay =
            <div>
                <Player 
                    user="Sample Opponent" playerColor={"Blue"}
                    health={opponentHealth} maxHealth={bHP}
                    strength={bSTR} intelligence={bINT} image={bIMG}>
                </Player>
                <Player
                    user="Sample Player" playerColor={"Red"}
                    health={playerHealth} maxHealth={rHP}
                    strength={rSTR} intelligence={rINT} image={rIMG}>
                </Player>
            </div>;
        } else {
            playerDisplay =
                <div>
                    <Player 
                        user="Sample Opponent" playerColor={"Red"}
                        health={opponentHealth} maxHealth={rHP} 
                        strength={rSTR} intelligence={rINT} image={rIMG}
                        >
                    </Player>
                    <Player
                        user="Sample Player" playerColor={"Blue"}
                        health={playerHealth} maxHealth={bHP}
                        strength={bSTR} intelligence={bINT} image={bIMG}>
                    </Player>
                </div>;
        }

        // Move Selection
        let options;
        if (this.state.hasChosen)
            options = <div></div>
        else {
            options = <div>
                Select a move:<br/>
                <AttackButton attack="Shell Slam" handleClick={() => this.chooseMove(1)}/><br/>
                <AttackButton attack="Quick Snap" handleClick={() => this.chooseMove(2)}/><br/>
                <AttackButton attack="Show off a Cool Stick" handleClick={() => this.chooseMove(3)}/>
            </div>
        }

        return (
            <div>
                <h1>Shell Struggle EXTREME</h1>
                {playerDisplay}
                {options}
            </div>
        );
    }
};

export default GameCycle;