// shop.jsx

import React from 'react';
import {
    MDBCard, 
    MDBCardBody, 
    MDBCardFooter, 
    MDBCardTitle, 
    MDBCardText, 
    MDBCardImage, 
    MDBContainer, 
    MDBRow, 
    MDBCol 
  } from 'mdb-react-ui-kit';
import './shop.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import {getWallet, incWallet, getTurtles, getUserProfile, getTurtleClasses, getTurtleClass, unlockTurtle} from "../database";
import {img1, img2, img3, img4, img5, img6, img7, img8, turtleClasses} from './bestiary';

//hard-coding in the default order:
const default_ordering = ['Standard', 'Builder', 'Chef', 'Tank', 'Wizard', 'Cupid', 'Robot', 'Mewtwo'];

function computePrice(turtleClass){
    const health = 5;
    const intelligence =6;
    const strength = 5;
    return health*(turtleClass.health) + intelligence*(turtleClass.intelligence) + strength*(turtleClass.strength);
}



function make_card(userID, turtleClass, isLocked) {
    const price = isLocked ? <MDBCardFooter> Price: ${computePrice(turtleClass)}</MDBCardFooter> : null;
    return (
      <MDBCol lg={true} style={{marginBottom: '1.5rem'}} className='col-3' key={turtleClass.className} id="fitheight">
        <MDBCard style={{ width: '18rem' }} className='h-100'>
        <MDBCardImage position='top' src={turtleClass.image} />
          <MDBCardBody>
            <MDBCardTitle>Class: {turtleClass.className}</MDBCardTitle>
            <MDBCardTitle>HP {turtleClass.health} / STR {turtleClass.strength} / INT {turtleClass.intelligence}</MDBCardTitle>
          </MDBCardBody>
          {price}
        </MDBCard>
      </MDBCol>
    );
  }  

class Shop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            username : "",
            balance: 0,
            unlockedCollection: [],
            lockedCollection: []

        };

        this.changeBalance = this.changeBalance.bind(this)

    };


    async changeBalance(amount){
        const bal = await incWallet(this.state.user.uid, amount);
        this.setState({
            balance: bal
        })
    }

    async refreshScreen(){
        const profile = await getUserProfile(this.state.user.uid);
        this.setState({
            username: profile.username,
            balance: profile.wallet,
            unlockedCollection: [],
            lockedCollection: []
        });

        //initializing locked and unlocked collections
        for( let i =0; i < default_ordering.length; i++){
            const turtle = turtleClasses[i];
            if(profile.turtles[default_ordering[i]]){
                this.setState(state => ({unlockedCollection: state.unlockedCollection.concat([turtle])}));
            }
            else{
                this.setState(state => ({lockedCollection: state.lockedCollection.concat([turtle])}));
            }
            
        }   

    }

    async buyTurtle(turtleClass){
        const price = computePrice(turtleClass);
        if(this.state.balance < price){
            const alertMessage = "Sorry " + this.state.username + ", you do not have enough money to purchase the " + turtleClass.className + " turtle.";
            alert(alertMessage);
        }
        else{
            const consentForm = prompt("Are you sure you want to purchase the " + turtleClass.className + " turtle? Type 'Y' for yes or 'N' for no.");
            if(consentForm === "Y" || consentForm === "y"){
                let turtleName = prompt("What would you like to name your " + turtleClass.className+ " turtle? You can always change the name on your profile page.", turtleClass.className);
                if(turtleName){
                    const decrementAmount = -1* price;
                    await incWallet(this.state.user.uid, decrementAmount);
                    await unlockTurtle(this.state.user.uid, turtleClass.className, turtleName);
                    alert("Purchase successful.");
                    this.refreshScreen(); 
                }
                else{
                    alert("Cancelled purchase.");
                }
            }
            else{
                alert("Cancelled purchase.");
            }
        }
    }
    

    async componentDidMount(){
        const profile = await getUserProfile(this.state.user.uid);
        this.setState({
            username: profile.username,
            balance: profile.wallet
        });

        //initializing locked and unlocked collections
        for( let i =0; i < default_ordering.length; i++){
            const turtle = turtleClasses[i];
            if(profile.turtles[default_ordering[i]]){
                this.setState(state => ({unlockedCollection: state.unlockedCollection.concat([turtle])}));
            }
            else{
                this.setState(state => ({lockedCollection: state.lockedCollection.concat([turtle])}));
            }
            
        }   
    }

    componentWillUnmount(){

    }
    
    render() {
       const profileURL = "/profile/" + this.state.user.uid;
        return (
        <div>
            <nav>
                <a className="button" href={profileURL}>Go back to profile</a>
                <button className="money" style={{float:'right'}} onClick={() => this.changeBalance(10)}>Free Money</button>
            </nav>
            <h1 className="title">Hello,  {this.state.username}! Welcome to the Shop</h1>
            <h3 className="wallet">Your Balance: ${this.state.balance}</h3>
            <br/>
            <div id="label">Owned Turtles</div>
            <div id="container">
                <MDBContainer id="flex">
                    <MDBRow>
                    { this.state.unlockedCollection.map(turtle => <div key={turtle.className} id="flexchild">{make_card(this.state.user.uid, turtle,false)}</div>)}
                    </MDBRow>
                </MDBContainer>
            </div>
            <br/>
            <div id="label">Locked Turtles</div>
            <div id="container">
                <MDBContainer id="flex">
                    <MDBRow>
                    { this.state.lockedCollection.map(turtle => <div id="flexchild" key={turtle.className} onClick={() => this.buyTurtle(turtle)}>{make_card(this.state.user.uid, turtle,true)}</div>)}
                    </MDBRow>
                </MDBContainer>
            </div>
        </div>
    );}
};

export default Shop;