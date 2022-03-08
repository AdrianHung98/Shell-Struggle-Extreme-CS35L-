// select-screen.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './select-screen.css';
import SignOutButton from '../sign-out-button';
import { firestore } from '../firebase';
import { getDoc, setDoc, updateDoc, doc } from "firebase/firestore";
import { incWallet, uploadPicture } from '../database';

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
    this.state = {
      icon: "",
      picUrl: ""
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  email = this.props.email;
  uid = this.props.uid;

  async componentDidMount() {
    const profileRef = doc(firestore, 'users/' + this.uid);
    const d = new Date();
    const date = String(d.getDate()) + "/" + String(d.getMonth() + 1) + "/" + String(d.getFullYear());

    let profile = await getDoc(profileRef);
    if (profile.exists()) {
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
        icon: "https://img.brickowl.com/files/image_cache/larger/lego-universe-bob-minifigure-25.jpg"
      });
      profile = await getDoc(profileRef);
    }
    this.setState({icon: profile.data().icon});
  }

  handleChange(event) {
    this.setState({picUrl: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    uploadPicture(this.uid, this.state.picUrl);
    this.setState({icon: this.state.picUrl});
  }

  render() {
    return (
      <div>
        <img src={this.state.icon} alt="" height="128" width="128"/>
        <h1>Profile:</h1>
        <nav
          style={{
            borderbottom: "solid 1px",
            paddingbottom: "1rem",
          }}
        >
        <Link to="/lobby">Lobby</Link><br/>
        <Link to="/bestiary">Bestiary</Link>
        </nav>
        <div>Signed in as {this.email}</div>
        <div>ID:{this.uid}</div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Profile Picture URL:
              <input type="text" value={this.state.picUrl} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <SignOutButton/>
      </div>
    );
  }
}

export default App;