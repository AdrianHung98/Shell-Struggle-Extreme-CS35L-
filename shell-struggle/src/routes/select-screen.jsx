// select-screen.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './select-screen.css';
import SignOutButton from '../sign-out-button';

function App() {
  return (
    <div>
      <h1>Pages:</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="/gameCycle">Game Cycle</Link>
      </nav>
      <SignOutButton/>
    </div>
  );
}

export default App;