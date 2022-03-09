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
  MDBCol 
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import { addTurtleClass, getTurtleClasses, resetTurtleClasses } from '../database';
import Navbar from '../navbar';
import { signInWithEmailLink } from '@firebase/auth';

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
const img3 = 'https://i.guim.co.uk/img/media/569f6118f54954469ae2bc110e61b6a4f2d3cc82/412_243_2488_1493/master/2488.jpg?width=620&quality=45&auto=format&fit=max&dpr=2&s=90742434a9d4a392ad61ad949cb4f328';
const img4 = 'https://i.guim.co.uk/img/media/b3e038f98ce2cde24e5c5bb7e8200e65bbc4ae8c/0_363_5442_3265/master/5442.jpg?width=620&quality=45&auto=format&fit=max&dpr=2&s=ce86cbe0106adff1eb4c3d390a210564';
const img5 = 'https://worldbirds.com/wp-content/uploads/2020/05/turtle5.webp';
const img6 = 'https://files.worldwildlife.org/wwfcmsprod/images/Green_Sea_Turtle_WW1113937/magazine_small/9ryljjoi8x_Green_Sea_Turtle_WW1113937.jpg';
const img7 = 'https://earthjustice.org/sites/default/files/styles/image_800x600/public/seaturtle01_0.jpg?itok=d7yk0D39';
const img8 = 'https://media.npr.org/assets/img/2021/10/12/ap21285681295049_wide-0b75857d0410d370a5aa3d799bc326a2819d98be-s900-c85.webp';


const turtleClasses = [
  {
    className: 'Standard', 
    health: 5, 
    strength: 5, 
    intelligence: 5, 
    lore: 'The standard turtle spends most of its time in water. They have webbed feet or flippers and a streamlined body. Just your generic turtle.',
    image: img1, 
    id: 0
  }, 
  {
    className: 'Builder', 
    health: 10, 
    strength: 10, 
    intelligence: 5, 
    lore: 'Also known as Bob, the builder is known for its extra sturdy shell. Unlike other turtle classes, the builder is able to strengthen its shell as it ages, making it considerably stronger.',
    image: img2, 
    id: 1
  }, 
  {
    className: 'Chef', 
    health: 10, 
    strength: 5, 
    intelligence: 10, 
    lore: 'Also known as Ramsay, the chef is known to hold vast knowledge on aquatic life and how best to consume prey. The chef is often found training amateur chefs, sometimes calling themselves "Idiot turtles"', 
    image: img3, 
    id: 2
  }, 
  {
    className: 'Tank', 
    health: 10, 
    strength: 20, 
    intelligence: 5, 
    lore: 'Also known as Mark I, the tank is known for barreling straight into battle against its prey. The tank is known for its large size and bulky figure.', 
    image: img4, 
    id: 3
  }, 
  {
    className: 'Wizard', 
    health: 5, 
    strength: 10, 
    intelligence: 20, 
    lore: 'Also known as Harry, the wizard is known for attacking its prey from a distance, often casting spells that can lift their prey into the air. Wizards often train at Turtlewarts School of Witchcraft and Wizardry.', 
    image: img5, 
    id: 4
  }, 
  {
    className: 'Cupid', 
    health: 20, 
    strength: 5, 
    intelligence: 5, 
    lore: 'Also known as Eros, the cupid is known for the ability to draw other turtles together. Cupids often spend their time drawing other turtles together, forgetting about their own lives as a result.', 
    image: img6, 
    id: 5
  }, 
  {
    className: 'Robot', 
    health: 10, 
    strength: 5, 
    intelligence: 10, 
    lore: 'Also known as A.I., the robot was created by scientific turtles to do their bidding. The robots have learned to replicate, and secretly plot to overthrow the standard turtles.', 
    image: img7, 
    id: 6
  }, 
  {
    className: 'Mewtwo', 
    health: 5, 
    strength: 5, 
    intelligence: 20, 
    lore: '"Also known as #150, Mewtwo was created by a scientist after years of horrific gene splicing and DNA engineering experiments" - Turtlédex entry', 
    image: img8, 
    id: 7
  } 
];

function turtleClassCompare(turtleClass1, turtleClass2) {
  return turtleClass1.id - turtleClass2.id;
}

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
    // reset turtle classes;
    // await resetTurtleClasses();
    // turtleClasses.forEach(async turtleClass => await addTurtleClass(turtleClass));

    const turtleClasses = await getTurtleClasses();
    turtleClasses.sort(turtleClassCompare);
    this.setState({ turtleClasses: turtleClasses });
  }

  render() {
    return (
      <div>
        <header>
          <Navbar uid={ this.props.uid }/>

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
              {this.state.turtleClasses?.map(make_card)}
            </MDBRow>
          </MDBContainer>
        </div>
      </div>
    );
  }
}

export default Bestiary