import React from 'react';
// import './bestiary.css';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// TODO: figure this out
const temp_turtles = [
  {
    name: 'a', 
    stat_1: 10, 
    stat_2: 10, 
    stat_3: 10, 
    lore: 'LOREm ipsum', 
    pic_url: 'https://images.squarespace-cdn.com/content/v1/5369465be4b0507a1fd05af0/1528837069483-LD1R6EJDDHBY8LBPVHIU/randall-ruiz-272502.jpg'
  }, 
  {
    name: 'b', 
    stat_1: 20, 
    stat_2: 20, 
    stat_3: 20, 
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
    <Col>
      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={turtle.pic_url} style={{width: '16rem'}}/>
        <Card.Body>
          <Card.Title>{turtle.name}</Card.Title>
          <Card.Text>
            Lore: {turtle.lore}
          </Card.Text>
          <Button variant="primary">do we need this button</Button>
        </Card.Body>
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
      
        <Container>
          <Row md={4}>
            {many_turtles.map(make_card)}
          </Row>
        </Container>
      </div>
    );
  }
}

export default Bestiary