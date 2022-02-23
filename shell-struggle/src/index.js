import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Turtle from './turtle.jsx';

const turtle = <Turtle 
  class='scientist' 
  attack_stat='5'
  wisdom_stat='10'
  speed_stat='5'
  image='https://cdn.drawception.com/images/panels/2017/5-8/SSFCdOc9BN-2.png'
/>

ReactDOM.render(
  turtle,
  document.getElementById('root')
);

