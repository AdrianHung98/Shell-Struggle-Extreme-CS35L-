// gameCycle.jsx

import React from 'react';
import { db } from '../firebase';
import { off, ref, onValue, set } from "firebase/database"; 
import { getUserProfile, incWallet } from '../database';
import Turtle from '../turtle';
import {
  MDBCard, 
  MDBCardBody, 
  MDBCardFooter, 
  MDBCardTitle, 
  MDBCardImage, 
  MDBContainer, 
  MDBRow, 
  MDBCol 
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { getTurtleClasses } from '../database';
import './game-cycle.css';

// Reference Arrays
const turtleClasses = ["Builder", "Chef", "Cupid", "Mewtwo", "Robot", "Standard", "Tank", "Wizard"];
const moves = ["", "Shell Slam", "Quick Snap", "Show off a Cool Stick"];
const speeds = [0, 7, 15, 9];
var messagesArray = [];


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
        <button className="attack btn bg-light ms-1 me-1" onClick={props.handleClick}>
            {props.attack}
        </button>
);}

function Player(props) {
  return (
    <MDBCol lg={true} style={{marginBottom: '1.5rem'}} className='d-flex justify-content-center col-6'>
      <MDBCard style={{ width: '18rem' }} className='h-100'>
        <MDBCardImage position='top' src={props.image} />
        <MDBCardBody>
          <MDBCardTitle>{props.user} 
          </MDBCardTitle>
          <div className="HealthBar">
            <div className="PercentageBar" style={{"visibility": props.health === 0 ? "hidden" : "visible","width": (100 * props.health / props.maxHealth).toString() + "%"}}></div>
          </div>
        </MDBCardBody>
        <MDBCardFooter>
          HP {props.health}/{props.maxHealth} / STR {props.strength} / INT {props.intelligence}
        </MDBCardFooter>
      </MDBCard>
    </MDBCol>
  );
}

class GameCycle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            message: "",
            redMove: "red",
            blueMove: "blue",
            redHealth: 100,
            blueHealth: 100,
            redTurtle: null,
            blueTurtle: null,
            room_id: null,
            turtleClasses: null,
            hasChosen: false,
            completed: false,
            numMessages: 1
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
        setRedCompleted(false);
        setBlueCompleted(false);
        setMessage([""]);

        onValue(movesRef, (snapshot) => {
            this.setState({blueMove: snapshot.val().blue});
            this.setState({redMove: snapshot.val().red});
            this.handleMoveUpdate(snapshot);  
        });

        onValue(messageRef, (snapshot) => {
            let messages = snapshot.val();
            this.setState({messages: messages});
            this.setState({numMessages: messages.length -1});
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
            if (this.playerColor === "Blue")
                this.setState({completed: snapshot.val().blue});
            if (completed.red && completed.blue) {
                this.setState({hasChosen: false});

                if (this.playerColor === "Red") {
                    this.processMoves();
                } else {return;}
                setBlueCompleted(false);
                setRedCompleted(false);
                setRedMove(0); setBlueMove(0);
            }
        });

        // Messages Timer
        this.timerID = setInterval(
            () => this.printMessage(), 
            3000
        );
    }

    // Stop tracking
    componentWillUnmount() {
        clearInterval(this.timerID);
        off(messageRef);
        off(movesRef);
        off(redHealthRef);
        off(blueHealthRef);
        off(redTurtleRef);
        off(blueTurtleRef);
        // This is a potential future memory leak, but
        // for a low number of users, it should be innocuous
        //remove(ref(db, this.props.room_id));
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
        messagesArray = [""];
    }

    translateMoveToDamage(move, attackerColor) {
        let damage;
        switch(move) {
            case 1: damage = 70; break;
            case 2: damage = 40; break;
            case 3: damage = Math.floor(Math.random() * (100 - 1) + 1); break; 
            default: damage = -1; break;
        }
        messagesArray.push(`${attackerColor} Player used "${moves[move]}"`);
        return damage;
    }

    attackRedPlayer(strength) {
        let damage = this.translateMoveToDamage(this.state.blueMove, "Blue");
        damage = damage + Math.floor(damage * (strength / 30));
        let newHealth = this.state.redHealth - damage;
        if (newHealth < 0)
            newHealth = 0;
        setRedHealth(newHealth);
        this.setState({redHealth: newHealth});
        messagesArray.push(`Blue Player attacked Red Player for ${damage} damage!`);
    }

    attackBluePlayer(strength) {
        let damage = this.translateMoveToDamage(this.state.redMove, "Red");
        damage = damage + Math.floor(damage * (strength / 30));
        let newHealth = this.state.blueHealth - damage;
        if (newHealth < 0)
            newHealth = 0;
        setBlueHealth(newHealth);
        this.setState({blueHealth: newHealth});
        messagesArray.push(`Red Player attacked Blue Player for ${damage} damage!`);
    }

    processMoves() {
        this.setState({completed: false});
        const turtles = this.state.turtleClasses;
        const rTurt = this.classToIndex(this.state.redTurtle);
        const bTurt = this.classToIndex(this.state.blueTurtle);
        const rINT = turtles[rTurt].intelligence; const rSTR = turtles[rTurt].strength;
        const bINT = turtles[bTurt].intelligence; const bSTR = turtles[bTurt].strength;

        const redMove = this.state.redMove;
        const blueMove = this.state.blueMove;

        let firstMove;
        let secondMove;
        if (speeds[redMove] + rINT === speeds[blueMove] + bINT) {
            let coin = Math.floor(Math.random());
            if (coin) {
                firstMove = () => this.attackRedPlayer(bSTR);
                secondMove = () => this.attackBluePlayer(rSTR);
            } else {
                firstMove = () => this.attackRedPlayer(bSTR);
                secondMove = () => this.attackBluePlayer(bSTR); 
            }
        } else {
            if (speeds[redMove] + rINT > speeds[blueMove] + bINT) {
                firstMove = () => this.attackBluePlayer(rSTR);
                secondMove = () => this.attackRedPlayer(bSTR);
            } else {
                firstMove = () => this.attackRedPlayer(bSTR);
                secondMove = () => this.attackBluePlayer(rSTR);
            }
        }

        firstMove();
        if (this.state.redHealth <= 0) { 
            messagesArray.push("Blue Player Won!"); 
            setMessage(messagesArray);
            return; 
        }
        if (this.state.blueHealth <= 0) { 
            messagesArray.push("Red Player Won!");
            setMessage(messagesArray);
            return;
        }

        secondMove();
        if (this.state.redHealth <= 0) { 
            messagesArray.push("Blue Player Won!"); 
            setMessage(messagesArray);
            return;
        }
        if  (this.state.blueHealth <= 0) { 
            messagesArray.push("Red Player Won!");
            setMessage(messagesArray);
            return; 
        }
        setMessage(messagesArray);
    }

    printMessage() {
        const messages = this.state.messages;
        if (messages.length === 1) { 
            this.setState({message: messages[1]});
            this.setState({numMessages: 0});
            return;
        }
        const message = messages[1];
        if (message === "Red Player Won!" || message === "Blue Player Won!") {
            this.setState({message: message});
        } else {
            this.setState({messages: messages.slice(1)});
        }
        this.setState({message: message});
        this.setState({numMessages: messages.length});
    }

    classToIndex(class_name) {
        for (let i = 0; i < 8; ++i) {
            if (turtleClasses[i] === class_name)
                return i;
        }
    }

    //Reward winner with money and send em home
    async rewardWinner(winnerColor){
        if(winnerColor === "none"){ return;}

        if(this.playerColor === winnerColor){
            await incWallet(this.props.uid, 100);
            alert("Congrats! You won $100!!");
        }
        window.location.href = `/profile/${this.props.uid}`;
    }

    render() {
        const message = this.state.message;

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
        const rIMG = turtles[rTurt].image; const rHP = 150 + (5 * turtles[rTurt].health);
        const bSTR = turtles[bTurt].strength; const bINT = turtles[bTurt].intelligence;
        const bIMG = turtles[bTurt].image; const bHP = 150 + (5 * turtles[bTurt].health);

        // Player Display
        let playerDisplay;
        if (this.playerColor === "Red") {
            playerDisplay =
              <MDBContainer className='container-fluid'>
                <MDBRow>
                  <Player
                      user="You" playerColor={"Red"}
                      health={playerHealth} maxHealth={rHP}
                      strength={rSTR} intelligence={rINT} image={rIMG}>
                  </Player>
                  <Player
                      user="Opponent" playerColor={"Blue"}
                      health={opponentHealth} maxHealth={bHP}
                      strength={bSTR} intelligence={bINT} image={bIMG}>
                  </Player>
                </MDBRow>
              </MDBContainer>;
        } else {
            playerDisplay =
              <MDBContainer className='container-fluid'>
                <MDBRow>
                  <Player
                      user="Opponent" playerColor={"Red"}
                      health={opponentHealth} maxHealth={rHP}
                      strength={rSTR} intelligence={rINT} image={rIMG}>
                  </Player>
                  <Player
                      user="You" playerColor={"Blue"}
                      health={playerHealth} maxHealth={bHP}
                      strength={bSTR} intelligence={bINT} image={bIMG}>
                  </Player>
                </MDBRow>
              </MDBContainer>;
        }

        //Winner winner chicken dinner
        var winnerColor = "none";
        const winnerDeclared = (message === "Red Player Won!" || message === "Blue Player Won!");
        if(winnerDeclared){
            if(message === "Red Player Won!"){ winnerColor = "Red";}
            else if(message === "Blue Player Won!"){winnerColor = "Blue";}
        }
        var renderOptionsID = (winnerDeclared) ? "invisible" : "";
        let returnButton = (winnerDeclared) ? <button className="btn-primary" onClick={() => this.rewardWinner(winnerColor)}>Go back to profile</button> : <div id="invisible"></div>;

        // Move Selection
        let options;
        if (this.state.hasChosen || this.state.completed 
            || message === "Red Player Won!" || message === "Blue Player Won!"
            || this.state.numMessages !== 0)
            options = <div></div>
        else {
            options = <div id={renderOptionsID}>
                <AttackButton attack="Shell Slam" handleClick={() => this.chooseMove(1)}/>
                <AttackButton attack="Quick Snap" handleClick={() => this.chooseMove(2)}/>
                <AttackButton attack="Show off a Cool Stick" handleClick={() => this.chooseMove(3)}/>
            </div>
        }

        return (
            <div>
              <h1 className="text-center">Shell Struggle EXTREME</h1>
              <hr />
              {playerDisplay}
              {
                message && message.trim() !== "" || options ? 
                  <MDBCard className="bg-dark BattleInterface">
                    <MDBCardBody>
                      <div className="text-white medium">{message}</div>
                      {options}
                      {returnButton}
                    </MDBCardBody>
                  </MDBCard>
                : 
                null 
              }
            </div>
        );
    }
};

export default GameCycle;