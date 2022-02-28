// gameCycle.jsx

import React from 'react';
import Turtle from '../turtle.jsx';
import '../turtle.css';

const turtle = <Turtle 
  class='scientist' 
  attack_stat='5'
  wisdom_stat='10'
  speed_stat='5'
  image='https://cdn.drawception.com/images/panels/2017/5-8/SSFCdOc9BN-2.png'
/>

class GameCycle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Red player fights blue player
            // Keep track of whose turn it is
            redIsNext: true,
            turnNumber: 0
        }
    }

    render() {
        return (
            <div>
                This is a holding page for the game. Here's a fun turtle:
                <div>{turtle}</div>
            </div>
        );
    }
}

export default GameCycle