import React from 'react';
import {
  MDBCard, 
  MDBCardBody, 
  MDBCardFooter, 
  MDBCardTitle, 
  MDBCardText, 
  MDBCardImage, 
  MDBContainer, 
  MDBRow, 
  MDBCol 
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { useParams } from 'react-router-dom';
import { getTurtleClass, getUserProfile, resetUserTurtles, unlockTurtle } from '../database.js';
import Navbar from '../navbar';

function make_card(turtleClass, name) {
  return (
    <MDBCol lg={true} style={{marginBottom: '1.5rem'}} className='col-3' key={turtleClass.className}>
      <MDBCard style={{ width: '18rem' }} className='h-100'>
        <MDBCardImage position='top' src={turtleClass.image} />
        <MDBCardBody>
          <MDBCardTitle>{name}</MDBCardTitle>
          <MDBCardText>
            Class: {turtleClass.className}
          </MDBCardText>
        </MDBCardBody>
        <MDBCardFooter>
          HP {turtleClass.health} / STR {turtleClass.strength} / INT {turtleClass.intelligence}
        </MDBCardFooter>
      </MDBCard>
    </MDBCol>
  );
}

function ProfileWrapper(props) {
  return (
    <Profile viewing_uid={useParams().viewing_uid} uid={props.uid} />
  );
}

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userProfile: null, 
      turtles: [] 
    };
  }

  async componentDidMount() {
    await resetUserTurtles(this.props.viewing_uid);
    // simulate user unlocking the 'Scientist' turtle class and naming it 'this is a custom name'
    await unlockTurtle(this.props.viewing_uid, 'Scientist', 'this is a custom name');
    // simulate user unlocking the 'b' turtle class and naming it 'this is a custom name'
    await unlockTurtle(this.props.viewing_uid, 'b', 'this is another custom name');
    await getUserProfile(this.props.viewing_uid).then(userProfile => this.setState({ userProfile: userProfile }));
    // preprocess the turtles into {turtleClass, name} format
    if (this.state.userProfile?.turtles) {
      const turtles = [];
      for (const key in this.state.userProfile.turtles) {
        const turtle = {
          turtleClass: await getTurtleClass(key), 
          name: this.state.userProfile.turtles[key]
        };
        turtles.push(turtle);
      }
      // render them
      this.setState({ turtles: turtles });
    }
  }

  render() {
    return (
      <div>
        <header>
          <Navbar uid={ this.props.uid }/>
        </header>

        <div style={{ height: '1.5rem' }} />
        <h1 style={{ textAlign: 'center' }}>display user data here...</h1>

        <hr />

        <div>
          <h1 style={{ textAlign: 'center' }}>My Turtles</h1>
          <div style={{ height: '1.5rem' }} />
          <MDBContainer className='container-fluid'>
            <MDBRow>
              { this.state.turtles.map(turtle => make_card(turtle.turtleClass, turtle.name)) }
            </MDBRow>
          </MDBContainer>
        </div>
      </div>
    );
  }
}

export default ProfileWrapper;