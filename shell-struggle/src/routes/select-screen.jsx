// select-screen.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './select-screen.css';
import SignOutButton from '../sign-out-button';
import { firestore } from '../firebase';
import { getDoc, setDoc, updateDoc, doc } from "firebase/firestore";

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  email = this.props.email;
  uid = this.props.uid;

  async componentDidMount() {
    const profileRef = doc(firestore, 'users/' + this.uid);
    const d = new Date();
    const date = String(d.getDate()) + "/" + String(d.getMonth()) + "/" + String(d.getFullYear());

    const profile = await getDoc(profileRef);
    if (profile.exists()) {
      updateDoc(profileRef, {
        loginDate: date
      });
    } else {
      setDoc(profileRef, {
        username: this.props.email,
        loginDate: date,
        wallet: 100,
        turtles: [true, false, false, false, false, false, false, false],
        names: ["", "", "", "", "", "", "", ""],
      });
    }
  }

  render() {
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
        <div>Signed in as {this.email}</div>
        <div>ID:{this.uid}</div>
        <SignOutButton/>
      </div>
    );
  }
}

export default App;