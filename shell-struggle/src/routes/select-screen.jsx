// select-screen.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './select-screen.css';
import SignOutButton from '../sign-out-button';

function App(props) {
  return (
    <div>
      <h1>Pages:</h1>
      <nav
        style={{
          borderbottom: "solid 1px",
          paddingbottom: "1rem",
        }}
      >
      <div><Link to="/gameCycleRed">Game Cycle as Red</Link></div>
      <div><Link to="/gameCycleBlue">Game Cycle as Blue</Link></div>
      </nav>

      <nav
        style={{
          borderbottom: "solid 1px",
          paddingbottom: "1rem",
        }}
      >
        <Link to="/bestiary">Bestiary</Link>
      </nav>
      <div>Signed in as {props.email}</div>
      <div>ID:{props.uid}</div>
      <SignOutButton/>
    </div>
  );
}

export default App;