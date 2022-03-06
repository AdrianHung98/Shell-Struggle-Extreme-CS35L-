import React from 'react';
// import './bestiary.css';
import { Card, Col, Container, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <Col lg={true} style={{marginBottom: '1.5rem'}}>
      <Card style={{ width: '18rem' }} className='h-100'>
        <Card.Img variant='bottom' src={turtle.pic_url} style={{width: '18rem'}}/>
        <Card.Body>
          <Card.Title>{turtle.name}</Card.Title>
          <Card.Text>
            {turtle.desc}
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          SPD {turtle.spd} / STR {turtle.str} / INT {turtle.int}
        </Card.Footer>
      </Card>
    </Col>
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
      
        <Container class='row-cols-4'>
          <Row>
            {many_turtles.map(make_card)}
          </Row>
        </Container>
      </div>
    );
  }
}

export default Bestiary