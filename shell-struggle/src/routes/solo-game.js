// solo-game.js

import React from 'react';
import { getUserProfile } from '../database';
import Turtle from '../turtle';
import { getTurtleClasses, incWallet } from '../database';
import './game-cycle.css';
import '../turtle.css'
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

// Reference Arrays
const turtleClasses = ["Builder", "Chef", "Cupid", "Mewtwo", "Robot", "Standard", "Tank", "Wizard"];
const moves = [" ", "Shell Slam", "Quick Snap", "Show off a Cool Stick"];
const speeds = [0, 15, 7, 9];
var messagesArray = [" "];


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

class SoloGameCycle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [" "],
            message: " ",
            redMove: 0,
            blueMove: 0,
            redHealth: 100,
            blueHealth: 100,
            redTurtle: null,
            blueTurtle: null,
            room_id: null,
            turtleClasses: null,
            hasChosen: false,
            numMessages: 1,
            loop: true
        };
        this.playerColor = "Blue";
    };

    // Track message, moves, and redIsNext in the realtime database
    async componentDidMount() {

        // Get entire turtle class
        const turtleClasses = await getTurtleClasses();
        this.setState({turtleClasses: turtleClasses});

        // Get Player turtles
        const choice = turtleClasses[Math.floor(Math.random() * 8)];
        this.setState({redTurtle: choice.className});
        const playerTurtle = (await getUserProfile(this.props.uid)).using;
        this.setState({blueTurtle: playerTurtle});

        const turtles = this.state.turtleClasses;
        const rTurt= this.classToIndex(this.state.redTurtle);
        const bTurt = this.classToIndex(this.state.blueTurtle);
        const rMaxHealth = (150 + (5 * turtles[rTurt].health));
        const bMaxHealth = (150 + (5 * turtles[bTurt].health));
        this.setState({redHealth: rMaxHealth});
        this.setState({blueHealth: bMaxHealth});

        this.timerID = setInterval(
            () => this.printMessage(),
            2500
          );
    }

    componentDidUpdate() {
        if (this.state.hasChosen && this.state.loop) {
            messagesArray = [" "];
            this.processMoves();
            this.setState({loop: false});
        }
    }

    // Stop tracking
    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    // Clicked a button
    chooseMove(move) {
        this.setState(
            {blueMove: move,
            hasChosen: true,
            loop: true
        });
        const turtles = this.state.turtleClasses;
        const rTurt = this.classToIndex(this.state.redTurtle);
        const rSTR = turtles[rTurt].strength;
        if (this.state.redHealth <= 40 + (40 * (rSTR / 30))) {
            this.setState({redMove: 2});
        } else {
            if (this.state.redHealth <= 70 + (70 * (rSTR / 30))) {
                this.setState({redMove: 1});
            } else {
                const coin = Math.floor(Math.random() * 2);
                if (coin) {
                    this.setState({redMove: 3});
                }
                else
                    this.setState({redMove: 1});
            }
        }
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
        this.setState({redHealth: newHealth});
        messagesArray.push(`Blue Player attacked Red Player for ${damage} damage!`);
        return newHealth;
    }

    attackBluePlayer(strength) {
        let damage = this.translateMoveToDamage(this.state.redMove, "Red");
        damage = damage + Math.floor(damage * (strength / 30));
        let newHealth = this.state.blueHealth - damage;
        if (newHealth < 0)
            newHealth = 0;
        this.setState({blueHealth: newHealth});
        messagesArray.push(`Red Player attacked Blue Player for ${damage} damage!`);
        return newHealth;
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
        let firstPlayer;
        let secondMove;
        let secondPlayer;
        if (speeds[redMove] + rINT === speeds[blueMove] + bINT) {
            let coin = Math.floor(Math.random() * 2);
            if (coin) {
                firstMove = () => this.attackRedPlayer(bSTR);
                firstPlayer = "Blue";
                secondMove = () => this.attackBluePlayer(rSTR);
                secondPlayer = "Red";
            } else {
                secondMove = () => this.attackRedPlayer(bSTR);
                firstPlayer = "Blue";
                firstMove = () => this.attackBluePlayer(rSTR);
                secondPlayer = "Red";
            }
        } else {
            if (speeds[redMove] + rINT > speeds[blueMove] + bINT) {
                firstMove = () => this.attackBluePlayer(rSTR);
                firstPlayer = "Red";
                secondMove = () => this.attackRedPlayer(bSTR);
                secondPlayer = "Blue";
            } else {
                firstMove = () => this.attackRedPlayer(bSTR);
                firstPlayer = "Blue";
                secondMove = () => this.attackBluePlayer(rSTR);
                secondPlayer = "Red";
            }
        }

        let newHealth = firstMove();
        if (newHealth <= 0) { 
            if (firstPlayer === "Red")
                messagesArray.push("Red Player Won!");
            else
                messagesArray.push("Blue Player Won!");
            this.setState({messages: messagesArray});
            return; 
        }

        newHealth = secondMove();
        if (newHealth <= 0) {
            if (secondPlayer === "Red")
                messagesArray.push("Red Player Won!");
            else
                messagesArray.push("Blue Player Won!");
            this.setState({messages: messagesArray});
            return; 
        }
        messagesArray.push(" ");
        this.setState({messages: messagesArray});
    }

    printMessage() {
        if (!this.state.hasChosen)
            return;
        const messages = this.state.messages;
        if (messages.length === 1) { 
            this.setState({message: messages[0]});
            this.setState({numMessages: 1});
            this.setState({hasChosen: false});
            return;
        }
        const message = messages[0];
        if (message === "Red Player Won!" || message === "Blue Player Won") {
            this.setState({messages: message});
            this.setState({hasChosen: true});
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
            await incWallet(this.props.uid, 50);
            alert("Congrats! You won $50!!");
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
            return(<div>Loading ... </div> || this.state.numMessages !== 1);
        const turtles = this.state.turtleClasses;
        const rTurt = this.classToIndex(this.state.redTurtle);
        const bTurt = this.classToIndex(this.state.blueTurtle);        
        const rSTR = turtles[rTurt].strength; const rINT = turtles[rTurt].intelligence;
        const rIMG = turtles[rTurt].image; const rHP = 150 + (5 * turtles[rTurt].health);
        const bSTR = turtles[bTurt].strength; const bINT = turtles[bTurt].intelligence;
        const bIMG = turtles[bTurt].image; const bHP = 150 + (5 * turtles[bTurt].health);

        // Player Display
        let playerDisplay =
          <MDBContainer className='container-fluid'>
            <MDBRow>
              <Player
                  user="Red Player (CPU)" playerColor={"Red"}
                  health={opponentHealth} maxHealth={rHP}
                  strength={rSTR} intelligence={rINT} image={rIMG}>
              </Player>
              <Player
                  user="Blue Player (You)" playerColor={"Blue"}
                  health={playerHealth} maxHealth={bHP}
                  strength={bSTR} intelligence={bINT} image={bIMG}>
              </Player>
            </MDBRow>
          </MDBContainer>;
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
        if (this.state.hasChosen || message === "Red Player Won!" 
            || message === "Blue Player Won!")
            options = null;
        else {
            options = <div className={renderOptionsID}>
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

export default SoloGameCycle;
