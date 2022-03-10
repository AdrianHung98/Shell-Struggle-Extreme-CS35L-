// shop.jsx

import React from 'react';
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
import './shop.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { incWallet, getUserProfile, unlockTurtle} from "../database";
//import {img1, img2, img3, img4, img5, img6, img7, img8, turtleClasses} from './bestiary.jsx';
import Navbar from '../navbar';


const img1 = 'https://images.squarespace-cdn.com/content/v1/5369465be4b0507a1fd05af0/1528837069483-LD1R6EJDDHBY8LBPVHIU/randall-ruiz-272502.jpg';
const img2 = 'https://news.stanford.edu/wp-content/uploads/2021/04/Sea-Turtle.jpg';
const img3 = 'https://i.guim.co.uk/img/media/569f6118f54954469ae2bc110e61b6a4f2d3cc82/412_243_2488_1493/master/2488.jpg?width=620&quality=45&auto=format&fit=max&dpr=2&s=90742434a9d4a392ad61ad949cb4f328';
const img4 = 'https://i.guim.co.uk/img/media/b3e038f98ce2cde24e5c5bb7e8200e65bbc4ae8c/0_363_5442_3265/master/5442.jpg?width=620&quality=45&auto=format&fit=max&dpr=2&s=ce86cbe0106adff1eb4c3d390a210564';
const img5 = 'https://worldbirds.com/wp-content/uploads/2020/05/turtle5.webp';
const img6 = 'https://files.worldwildlife.org/wwfcmsprod/images/Green_Sea_Turtle_WW1113937/magazine_small/9ryljjoi8x_Green_Sea_Turtle_WW1113937.jpg';
const img7 = 'https://earthjustice.org/sites/default/files/styles/image_800x600/public/seaturtle01_0.jpg?itok=d7yk0D39';
const img8 = 'https://magnetricity.files.wordpress.com/2019/04/mewtwo-plush-detective-pikachu-posable.png';


const turtleClasses = [
  {
    className: 'Standard', 
    health: 5, 
    strength: 5, 
    intelligence: 5, 
    lore: 'The standard turtle spends most of its time in water. They have webbed feet or flippers and a streamlined body. Just your generic turtle.',
    image: img1, 
    id: 0
  }, 
  {
    className: 'Builder', 
    health: 10, 
    strength: 10, 
    intelligence: 5, 
    lore: 'Also known as Bob, the builder is known for its extra sturdy shell. Unlike other turtle classes, the builder is able to strengthen its shell as it ages, making it considerably stronger.',
    image: img2, 
    id: 1
  }, 
  {
    className: 'Chef', 
    health: 10, 
    strength: 5, 
    intelligence: 10, 
    lore: 'Also known as Ramsay, the chef is known to hold vast knowledge on aquatic life and how best to consume prey. The chef is often found training amateur chefs, sometimes calling themselves "Idiot turtles"', 
    image: img3, 
    id: 2
  }, 
  {
    className: 'Tank', 
    health: 10, 
    strength: 20, 
    intelligence: 5, 
    lore: 'Also known as Mark I, the tank is known for barreling straight into battle against its prey. The tank is known for its large size and bulky figure.', 
    image: img4, 
    id: 3
  }, 
  {
    className: 'Wizard', 
    health: 5, 
    strength: 10, 
    intelligence: 20, 
    lore: 'Also known as Harry, the wizard is known for attacking its prey from a distance, often casting spells that can lift their prey into the air. Wizards often train at Turtlewarts School of Witchcraft and Wizardry.', 
    image: img5, 
    id: 4
  }, 
  {
    className: 'Cupid', 
    health: 20, 
    strength: 5, 
    intelligence: 5, 
    lore: 'Also known as Eros, the cupid is known for the ability to draw other turtles together. Cupids often spend their time drawing other turtles together, forgetting about their own lives as a result.', 
    image: img6, 
    id: 5
  }, 
  {
    className: 'Robot', 
    health: 10, 
    strength: 5, 
    intelligence: 10, 
    lore: 'Also known as A.I., the robot was created by scientific turtles to do their bidding. The robots have learned to replicate, and secretly plot to overthrow the standard turtles.', 
    image: img7, 
    id: 6
  }, 
  {
    className: 'Mewtwo', 
    health: 5, 
    strength: 5, 
    intelligence: 30, 
    lore: '"Also known as #150, Mewtwo was created by a scientist after years of horrific gene splicing and DNA engineering experiments" - Turtlédex entry', 
    image: img8, 
    id: 7
  } 
];

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
       //const profileURL = "/profile/" + this.state.user.uid;
        return (
        <div>
            <header>
          <Navbar uid={ this.state.user.uid }/>
        </header>
        <div
            className='p-5 text-center bg-image'
            style={{ backgroundImage: "url('https://wallpaperaccess.com/full/2819122.jpg')", height: 400 }}
          ></div>
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