// select-screen.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './select-screen.css';
import SignOutButton from '../sign-out-button';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: "",
      picUrl: "",
      requests: []
    }
  }
  email = this.props.email;
  uid = this.props.uid;

  render() {

    return (
      <div>
        <h1>Profile:</h1>
        <nav
          style={{
            borderbottom: "solid 1px",
            paddingbottom: "1rem",
          }}
        >
        <Link to="/bestiary">Bestiary</Link><br/>
        <Link to={ `/profile/${this.props.uid}` }>Profile</Link><br/>
        <Link to="/shop">Shop</Link><br/>
        <Link to="/gameCycleRed">Red Team</Link><br/>
        <Link to="/gameCycleBlue">Blue Team</Link>
        </nav>
        <div>Signed in as {this.email}</div>
        <div>ID:{this.uid}</div>
        <SignOutButton/>
      </div>
    );
  }
}

export default App;