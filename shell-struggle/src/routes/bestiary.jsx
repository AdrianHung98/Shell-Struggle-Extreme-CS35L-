import React from 'react';
// import './bestiary.css';
import { MDBCard, MDBCardBody, MDBCardFooter, MDBCardTitle, MDBCardText, MDBCardImage, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import 'bootstrap/dist/css/bootstrap.min.css';

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

// TODO: figure this out
const temp_turtles = [
  {
    name: 'a', 
    desc: 'first temp turtle', 
    spd: 10, 
    str: 10, 
    int: 10, 
    lore: 'LOREm ipsum', 
    pic_url: 'https://images.squarespace-cdn.com/content/v1/5369465be4b0507a1fd05af0/1528837069483-LD1R6EJDDHBY8LBPVHIU/randall-ruiz-272502.jpg'
  }, 
  {
    name: 'b', 
    desc: 'second temp turtle', 
    spd: 20, 
    str: 20, 
    int: 20, 
    lore: 'b stands for better', 
    pic_url: 'https://news.stanford.edu/wp-content/uploads/2021/04/Sea-Turtle.jpg'
  }
];

const many_turtles = [
  temp_turtles[0], 
  temp_turtles[1], 
  temp_turtles[0], 
  temp_turtles[1], 
  temp_turtles[0], 
  temp_turtles[1], 
  temp_turtles[0], 
  temp_turtles[1], 
  temp_turtles[0], 
  temp_turtles[1], 
  temp_turtles[0], 
  temp_turtles[1], 
  temp_turtles[0], 
  temp_turtles[1], 
  temp_turtles[0], 
  temp_turtles[1], 
  temp_turtles[0], 
  temp_turtles[1] 
]

function make_card(turtle) {
  return (
    <MDBCol lg={true} style={{marginBottom: '1.5rem'}} className='col-3'>
      <MDBCard style={{ width: '18rem' }} className='h-100'>
        <MDBCardImage variant='bottom' src={turtle.pic_url} />
        <MDBCardBody>
          <MDBCardTitle>{turtle.name}</MDBCardTitle>
          <MDBCardText>
            {turtle.desc}
          </MDBCardText>
        </MDBCardBody>
        <MDBCardFooter>
          SPD {turtle.spd} / STR {turtle.str} / INT {turtle.int}
        </MDBCardFooter>
      </MDBCard>
    </MDBCol>
  );
}

class Bestiary extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>hi</h1>
      
        <MDBContainer className='container-fluid'>
          <MDBRow>
            {many_turtles.map(make_card)}
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}

export default Bestiary