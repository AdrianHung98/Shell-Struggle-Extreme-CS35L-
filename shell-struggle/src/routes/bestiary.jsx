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
  temp_turtles[1], 
  temp_turtles[0], 
  temp_turtles[1], 
  temp_turtles[0], 
  temp_turtles[0], 
  temp_turtles[1], 
  temp_turtles[0], 
  temp_turtles[1], 
  temp_turtles[1], 
  temp_turtles[0], 
  temp_turtles[1], 
  temp_turtles[0], 
  temp_turtles[0], 
  temp_turtles[1] 
]

// TODO
function temp_header() {
  return (
    <MDBNavbar expand='lg' light bgColor='white'>
      <MDBContainer fluid>
        <MDBNavbarToggler
          aria-controls='navbarExample01'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <MDBIcon fas icon='bars' />
          {/* icon does not show up */}
        </MDBNavbarToggler>
        <div className='collapse navbar-collapse' id='navbarExample01'>
          <MDBNavbarNav right className='mb-2 mb-lg-0'>
            <MDBNavbarItem active>
              <MDBNavbarLink aria-current='page' href='#'>
                Home (spoiler: doesnt work)
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='#'>Some Link</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='#'>Some Other Link</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='#'>Some Other Link 2</MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </div>
      </MDBContainer>
    </MDBNavbar>
  );
}

function make_card(turtle) {
  {/* currently causes duplicate keys but shouldnt matter later */}
  return (
    <MDBCol lg={true} style={{marginBottom: '1.5rem'}} className='col-3' key={turtle}>
      <MDBCard style={{ width: '18rem' }} className='h-100'>
        <MDBCardImage position='top' src={turtle.pic_url} />
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
        <header>
          {temp_header()}

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
              {many_turtles.map(make_card)}
            </MDBRow>
          </MDBContainer>
        </div>
      </div>
    );
  }
}

export default Bestiary