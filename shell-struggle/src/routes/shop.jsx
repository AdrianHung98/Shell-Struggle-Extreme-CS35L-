// shop.jsx

import React from 'react';
import './shop.css';
import {getWallet, incWallet, getTurtles} from "../database";

class Shop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            balance: 0,
            turtles: [],
            unlockedCollection: [],
            lockedCollection: []

        };

        this.changeBalance = this.changeBalance.bind(this)

    };

    async changeBalance(){
        var bal = await incWallet(this.state.user.uid, 10);
        this.setState({
            balance: bal
        })
    }


    async componentDidMount(){
        var bal = await getWallet(this.state.user.uid);
        var turts = await getTurtles(this.state.user.uid);

        this.setState({
            balance: bal,
            turtles: turts
        });

        let unlockedCollection = [];
        
        for(let i = 0; i < this.state.turtles.length; i++){

            if(this.state.turtles[i] === true){
                this.setState(
                    state => 
                    ({unlockedCollection: state.unlockedCollection.concat([state.turtles[i]])})
                );
            }
            else{
                this.setState(
                    state => 
                    ({locked: state.lockedCollection.concat([state.turtles[i]])})
                );
            }
        }

    }

    componentWillUnmount(){

    }
    
    render() {
        return (
        <div>
            <nav>
                <a className="button" href="/select-screen">Go back</a>
                <button className="money" style={{float:'right'}} onClick={this.changeBalance}>Free Money</button>
            </nav>
            <h1 className="title">Hello,  {this.state.user.displayName}! Welcome to the Shop</h1>
            <h3 className="wallet">Your Balance: ${this.state.balance} </h3>
            <br/>
            <div id="label">Your Collection</div>
            <div id="container">
                <div style={{marginLeft:0}} className="turtlecard">Turtle 1</div>
                <div className="turtlecard">Turtle 2</div>
                <div className="turtlecard">Turtle 3</div>
                <div className="turtlecard">Turtle 4</div>

            </div>
            <br/>
            <div id="label">Locked Turtles</div>
            <div id="container">
                <div style={{marginLeft:0}}className="turtlecard">Turtle 1</div>
                <div className="turtlecard">Turtle 2</div>
                <div className="turtlecard">Turtle 3</div>
                <div className="turtlecard">Turtle 4</div>

            </div>
        </div>
    );}
};

export default Shop;