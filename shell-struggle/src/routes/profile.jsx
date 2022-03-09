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
    await resetUserTurtles(this.props.uid);
    // simulate user unlocking the 'Standard' turtle class and naming it 'this is a custom name'
    await unlockTurtle(this.props.uid, 'Standard', 'this is a custom name');
    // simulate user unlocking the 'Chef' turtle class and naming it 'this is a custom name'
    // await unlockTurtle(this.props.viewing_uid, 'Chef', 'this is another custom name');
    await getUserProfile(this.props.uid).then(userProfile => this.setState({ userProfile: userProfile }));
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

  /**
   * see: 
   * https://mdbootstrap.com/docs/standard/extended/profiles/
   */
  render() {
    return (
      <div>
        <header>
          <Navbar uid={ this.props.uid }/>
        </header>

        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-md-9 col-lg-7 col-xl-5">
              <div className="d-flex text-black">
                <div className="flex-shrink-0">
                  <img src={ this.state.userProfile?.icon } alt="Generic placeholder image" className="img-fluid" style={{ width: '12rem', borderRadius: '10px' }} />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5 className="mb-1">{ this.state.userProfile?.username }</h5>
                  <p className="mb-2 pb-1" style={{ color: '#2b2a2a' }}>{ this.state.userProfile?.turtles ? Object.keys(this.state.userProfile.turtles).length : '???' } Turtle{ this.state.userProfile?.turtles ? Object.keys(this.state.userProfile.turtles).length == 1 ? '' : 's' : '' } Collected</p>
                  <div className="d-flex pt-1">
                    {
                      this.props.uid == this.props.viewing_uid ? null : 
                        <button type="button" className="btn btn-primary flex-grow-1">Challenge</button>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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