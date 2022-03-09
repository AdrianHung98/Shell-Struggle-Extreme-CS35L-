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
import 'font-awesome/css/font-awesome.min.css'
import { useParams } from 'react-router-dom';
import { getUserRef, getTurtleClass, getUserProfile, renameTurtle, resetUserTurtles, unlockTurtle, incWallet } from '../database';
import { firestore } from "../firebase";
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import Navbar from '../navbar';

function make_card(turtleClass, name, editable, renameCallback) {
  return (
    <MDBCol lg={true} style={{marginBottom: '1.5rem'}} className='col-3' key={turtleClass.className}>
      <MDBCard style={{ width: '18rem' }} className='h-100'>
        <MDBCardImage position='top' src={turtleClass.image} />
        <MDBCardBody>
          <MDBCardTitle>{name + '  '} 
          {
            editable ?
            <i className="fa fa-edit" onClick={ async () => {
              const newName = prompt('Please give this turtle a new name: ', name);
              if (!newName) return; 
              await renameCallback(turtleClass, newName);
            } }/>
            :
            null
          }
          </MDBCardTitle>
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

function newDateIsOneDayLater(oldDate, newDate) {
  const old_split = oldDate.split("/");
  const new_split = newDate.split("/");
  const microsInDay = 86400000;
  oldDate = new Date(old_split[2], old_split[1], old_split[0]);
  newDate = new Date(new_split[2], new_split[1], new_split[0]);
  const diff = Math.abs(oldDate - newDate);
  return (diff < 2 * microsInDay) && (diff >= microsInDay)
}

function useHookToGetViewingUID(props) {
  const params = useParams();
  if (Object.keys(params).includes('viewing_uid')) return params.viewing_uid;
  else return props.uid;
}

function ProfileWrapper(props) {
  return (
    <Profile viewing_uid={ useHookToGetViewingUID(props) } uid={props.uid} email={props.email} />
  );
}

function turtleCompare(turtle1, turtle2) {
  return turtle1.turtleClass.id - turtle2.turtleClass.id;
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
    // await resetUserTurtles(this.props.viewing_uid);
    // simulate user unlocking the 'Standard' turtle class and naming it 'this is a custom name'
    // await unlockTurtle(this.props.viewing_uid, 'Standard', 'this is a custom name');
    // simulate user unlocking the 'Chef' turtle class and naming it 'this is a custom name'
    // await unlockTurtle(this.props.viewing_uid, 'Chef', 'this is another custom name');
    
    const d = new Date();
    const date = String(d.getDate()) + "/" + String(d.getMonth() + 1) + "/" + String(d.getFullYear());
    const profileRef = await getUserRef(this.props.viewing_uid);
    let profile = await getDoc(profileRef);
    if (this.props.uid === this.props.viewing_uid){
      if (profile.exists()) {
        if (newDateIsOneDayLater(profile.data().loginDate, date)) {
          incWallet(this.user.uid, 100);
        }
        updateDoc(profileRef, {
          loginDate: date,
        });
      } else {
        setDoc(profileRef, {
          username: this.props.email,
          loginDate: date,
          wallet: 100,
          turtles: { Standard: 'Dumbo' }, 
          icon: "https://img.brickowl.com/files/image_cache/larger/lego-universe-bob-minifigure-25.jpg",
          requests: []
        });
        const userMapRef = await doc(firestore, 'users/userMap');
        const userMap = (await getDoc(userMapRef)).data();
        userMap[this.props.email] = this.props.uid;
        setDoc(userMapRef, userMap);
        profile = await getDoc(profileRef);
      }
    }
    const userProfile = profile?.data();
    this.setState({ userProfile: userProfile });
    
    // preprocess the turtles into {turtleClass, name} format
    if (userProfile.turtles) {
      const turtles = [];
      for (const key in userProfile.turtles) {
        const turtle = {
          turtleClass: await getTurtleClass(key), 
          name: userProfile.turtles[key]
        };
        turtles.push(turtle);
      }
      turtles.sort(turtleCompare);
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
                  <img src={ this.state.userProfile?.icon } alt="User Profile Picture" className="img-fluid" style={{ width: '12rem', borderRadius: '10px' }} />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5 className="mb-1">{ this.state.userProfile?.username }</h5>
                  
                  <p className="mb-0 pb-0" style={{ color: '#2b2a2a' }}><i className="fa fa-money" /> { this.state.userProfile?.wallet }</p>
                  <p className="mb-1 pb-1" style={{ color: '#2b2a2a' }}>{ this.state.userProfile?.turtles ? Object.keys(this.state.userProfile.turtles).length : '???' } Turtle{ this.state.userProfile?.turtles ? Object.keys(this.state.userProfile.turtles).length === 1 ? '' : 's' : '' } Collected</p>
                  <div className="d-flex pt-1">
                    {
                      this.props.uid == this.props.viewing_uid ? 
                        <div>
                          <button type="button" className="btn btn-primary flex-grow-1 mb-1" onClick={async () => {
                            const profileRef = await getUserRef(this.props.uid);
                            const profile = (await getDoc(profileRef)).data();
                            const username = prompt("Please enter a new username: ", profile.username);
                            if (!username) return;
                            const userMapRef = await doc(firestore, 'users/userMap');
                            const userMap = (await getDoc(userMapRef)).data();
                            if (userMap[username]) {
                              if (userMap[username] !== this.props.uid) alert(`Username change failed. Username "${username}" is already in use.`);
                              return;
                            }
                            delete userMap[profile.username];
                            userMap[username] = this.props.uid;
                            setDoc(userMapRef, userMap);
                            await updateDoc(profileRef, { username: username });
                            const newUserProfile = (await getDoc(profileRef)).data();
                            this.setState({ userProfile: newUserProfile });
                          }}>Change Username</button>

                          <button type="button" className="btn btn-primary flex-grow-1" onClick={async () => {
                            const profileRef = await getUserRef(this.props.uid);
                            const profile = (await getDoc(profileRef)).data();
                            const icon = prompt("Please enter the url for the new profile picture: ", profile.icon);
                            if (!icon) return;
                            await updateDoc(profileRef, { icon: icon });
                            const newUserProfile = (await getDoc(profileRef)).data();
                            this.setState({ userProfile: newUserProfile });
                          }}>Change Profile Picture</button>
                        </div>
                      : 
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
              { this.state.turtles.map(turtle => make_card(turtle.turtleClass, turtle.name, this.props.uid === this.props.viewing_uid, async (turtleClass, newName) => {
                const turtles = this.state.turtles;
                const turtle = turtles.filter(turtle => turtle.turtleClass.className === turtleClass.className)?.[0];
                if (!turtle) return;
                const newTurtles = turtles.filter(turtle => turtle.turtleClass.className !== turtleClass.className);
                turtle.name = newName;
                newTurtles.push(turtle);
                newTurtles.sort(turtleCompare);
                const userTurtles = this.state.userProfile.turtles;
                userTurtles[turtle.turtleClass.className] = newName;
                const profileRef = await getUserRef(this.props.uid);
                await updateDoc(profileRef, { turtles: userTurtles });
                this.setState({ turtles: newTurtles });
              })) }
            </MDBRow>
          </MDBContainer>
        </div>
      </div>
    );
  }
}

export default ProfileWrapper;