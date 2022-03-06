import React from 'react';
// import './bestiary.css';
import {
  MDBCard, 
  MDBCardBody, 
  MDBCardFooter, 
  MDBCardTitle, 
  MDBCardText, 
  MDBCardImage, 
  MDBContainer, 
  MDBRow, 
  MDBCol, 
  MDBNavbar, 
  MDBNavbarItem, 
  MDBNavbarLink, 
  MDBNavbarNav, 
  MDBNavbarToggler, 
  MDBIcon
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import { addTurtleClass, getTurtleClasses, resetTurtleClasses } from '../database';
import Navbar from '../navbar';

/**
 * see: 
 * https://react-bootstrap.github.io/components/cards/
 * https://react-bootstrap.github.io/layout/grid/
 *
 * ^scratch that^
 * 
 * see: 
 * https://mdbootstrap.com/docs/b5/react/components/cards/
 * https://mdbootstrap.com/docs/b5/react/layout/grid/
 * https://mdbootstrap.com/docs/b5/react/navigation/headers/
 */

/**
 * see: 
 * https://react-bootstrap.github.io/components/cards/
 * https://react-bootstrap.github.io/layout/grid/
 *
 * ^scratch that^
 * 
 * see: 
 * https://mdbootstrap.com/docs/b5/react/components/cards/
 * https://mdbootstrap.com/docs/b5/react/layout/grid/
 */

const img1 = 'https://images.squarespace-cdn.com/content/v1/5369465be4b0507a1fd05af0/1528837069483-LD1R6EJDDHBY8LBPVHIU/randall-ruiz-272502.jpg';
const img2 = 'https://news.stanford.edu/wp-content/uploads/2021/04/Sea-Turtle.jpg';

const temp_turtleClasses = [
  {
    className: 'Scientist', 
    health: 10, 
    strength: 10, 
    intelligence: 10, 
    lore: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 
    image: img1
  }, 
  {
    className: 'b', 
    health: 20, 
    strength: 20, 
    intelligence: 20, 
    lore: 'b stands for better', 
    image: img2
  }, 
  {
    className: 'another', 
    health: 30, 
    strength: 30, 
    intelligence: 30, 
    lore: 'this is another', 
    image: img1
  }
];

function make_card(turtleClass) {
  return (
    <MDBCol lg={true} style={{marginBottom: '1.5rem'}} className='col-3' key={turtleClass.className}>
      <MDBCard style={{ width: '18rem' }} className='h-100'>
        <MDBCardImage position='top' src={turtleClass.image} />
        <MDBCardBody>
          <MDBCardTitle>{turtleClass.className} class</MDBCardTitle>
          <MDBCardText>
            Lore: {turtleClass.lore}
          </MDBCardText>
        </MDBCardBody>
        <MDBCardFooter>
          HP {turtleClass.health} / STR {turtleClass.strength} / INT {turtleClass.intelligence}
        </MDBCardFooter>
      </MDBCard>
    </MDBCol>
  );
}

class Bestiary extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      turtleClasses: null
    };
  }
  
  async componentDidMount() {
    await resetTurtleClasses();
    temp_turtleClasses.forEach(async turtleClass => await addTurtleClass(turtleClass));
    await getTurtleClasses().then(turtleClasses => this.setState({ turtleClasses: turtleClasses }));
  }

  render() {
    return (
      <div>
        <header>
          <Navbar />

          <div
            className='p-5 text-center bg-image'
            style={{ backgroundImage: "url('http://www.thestoryoftexas.com/upload/images/events/movies/turtle-odyssey-banner-mobile.jpg')", height: 400 }}
          >
            <div className='mask' style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
              <div className='d-flex justify-content-center align-items-center h-100'>
                <div className='text-white'>
                  <h1 className='mb-3'>Bestiary</h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <div style={{ height: '1.5rem' }}/>
        <div>
          <MDBContainer className='container-fluid'>
            <MDBRow>
              {/* many_turtles.map(make_card) */}
              {this.state.turtleClasses?.map(make_card)}
            </MDBRow>
          </MDBContainer>
        </div>
      </div>
    );
  }
}

export default Bestiary