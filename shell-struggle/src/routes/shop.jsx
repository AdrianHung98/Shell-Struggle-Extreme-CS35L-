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
import { incWallet, getUserProfile, unlockTurtle, getTurtles, getTurtleClasses, turtleClassCompare} from "../database";
//import {img1, img2, img3, img4, img5, img6, img7, img8, turtleClasses} from './bestiary.jsx';
import Navbar from '../navbar';


//hard-coding in the default order:
const default_ordering = ['Standard', 'Builder', 'Chef', 'Tank', 'Wizard', 'Cupid', 'Robot', 'Mewtwo'];

function computePrice(turtleClass){
    const health = 5;
    const intelligence = 6;
    const speed = 6;
    const strength = 5;
    return health*(turtleClass.health) + speed*(turtleClass.speed) + strength*(turtleClass.strength);
}



function make_card(turtleClass, isLocked, buttonFunction) {
    const price = isLocked ? <MDBCardFooter> Price: {computePrice(turtleClass)} <i className="fa fa-money" /></MDBCardFooter> : null;
    return (
      <MDBCol lg={true} style={{marginBottom: '1.5rem'}} className='col-3' key={turtleClass.className}>
        <MDBCard style={{ width: '18rem' }} className='h-100' onClick={buttonFunction}>
        <MDBCardImage position='top' src={turtleClass.image} />
          <MDBCardBody>
            <MDBCardTitle>Class: {turtleClass.className}</MDBCardTitle>
            <MDBCardText>HP {turtleClass.health} / STR {turtleClass.strength} / SPD {turtleClass.speed}</MDBCardText>
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
            turtleClasses: [],
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
            const turtle = this.state.turtleClasses[i];
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
    
    testing(){
        console.log("clicked ");
    }

    async componentDidMount(){

        
        const retrievedTurtleClasses = await getTurtleClasses();
        retrievedTurtleClasses.sort(turtleClassCompare);

        const profile = await getUserProfile(this.state.user.uid);
        this.setState({
            username: profile.username,
            balance: profile.wallet,
            turtleClasses: retrievedTurtleClasses
        });

        //initializing locked and unlocked collections
        for( let i =0; i < default_ordering.length; i++){
            const turtle = this.state.turtleClasses[i];
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
       //const profileURL = "/profile/" + this.state.user.uid;
        return (
        <div>
            <header>
              <Navbar uid={ this.state.user.uid }/>
          
              <div
                  className='p-5 text-center bg-image'
                  style={{ backgroundImage: "url('https://wallpaperaccess.com/full/2819122.jpg')", height: 400 }}
              >
                <div className='mask' style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                  <div className='d-flex justify-content-center align-items-center h-100'>
                    <div className='text-white'>
                      <h1 className='mb-3'>Hello, {this.state.username}! Welcome to the Shop!</h1>
                      <h2>{ `${this.state.balance}` } <i className="fa fa-money" onClick={ () => this.changeBalance(100) }/></h2>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <h1 className="title text-black pb-1"></h1>
            <br/>
            <h1 style={{ textAlign: 'center' }}>Owned Turtles</h1>
            <div>
                <MDBContainer className="container-fluid">
                    <MDBRow>
                    { this.state.unlockedCollection.map(turtle => make_card(turtle,false, ()=>{} ))}
                    </MDBRow>
                </MDBContainer>
            </div>
            <hr/>
            <h1 style={{ textAlign: 'center' }}>Locked Turtles</h1>
            <div>
                <MDBContainer className="container-fluid">
                    <MDBRow>
                    { this.state.lockedCollection.map(turtle => make_card(turtle,true, () => this.buyTurtle(turtle))
                                                        )}
                    </MDBRow>
                </MDBContainer>
            </div>
        </div>
    );}
};

export default Shop;