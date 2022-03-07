// select-screen.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './select-screen.css';
import SignOutButton from '../sign-out-button';
import { firestore } from '../firebase';
import { getDoc, setDoc, updateDoc, doc } from "firebase/firestore";
import { incWallet } from '../database';

function newDateIsOneDayLater(oldDate, newDate) {
  const old_split = oldDate.split("/");
  const new_split = newDate.split("/");
  const microsInDay = 86400000;
  oldDate = new Date(old_split[2], old_split[1], old_split[0]);
  newDate = new Date(new_split[2], new_split[1], new_split[0]);
  const diff = Math.abs(oldDate - newDate);
  return (diff < 2 * microsInDay) && (diff >= microsInDay)
}

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  email = this.props.email;
  uid = this.props.uid;

  async componentDidMount() {
    const profileRef = doc(firestore, 'users/' + this.uid);
    const d = new Date();
    const date = String(d.getDate()) + "/" + String(d.getMonth() + 1) + "/" + String(d.getFullYear());

    const profile = await getDoc(profileRef);
    if (profile.exists()) {
      let updateData = {};
      if (newDateIsOneDayLater(profile.data().loginDate, date)) {
        incWallet(this.uid, 100);
      }
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