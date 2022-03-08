
import React from 'react';
import Navbar from '../navbar';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    console.log('loading profile page');
  }

  render() {
    return (
      <div>
        <header>
          <Navbar />
        </header>

        hi       
      </div>
    );
  }
}

export default Profile