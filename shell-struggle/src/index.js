import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from '@firebase/auth';
import SignInScreen from './sign-in-screen';
import App from './routes/select-screen';
import GameCycle from './routes/game-cycle.jsx';
import Bestiary from './routes/bestiary.jsx';
import ProfileWrapper from './routes/profile.jsx';
import Lobby from './routes/lobby.js';
import Shop from './routes/shop.jsx';
import './index.css';

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    const email = user.email;

    ReactDOM.render(
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<ProfileWrapper viewing_uid={uid} uid={uid} email={email}/>}/>
          <Route exact path="/select-screen" element={<App uid={uid} email={email}/>}/>
          <Route exact path="/bestiary" element={<Bestiary uid={uid}/>}/>
          <Route exact path="/profile/:viewing_uid" element={<ProfileWrapper uid={uid} email={email}/>}/>
          <Route path="gameCycleRed" element={<GameCycle uid={uid} playerColor="Red" opponentColor="Blue"/>}/>
          <Route path="gameCycleBlue" element={<GameCycle uid={uid} playerColor="Blue" opponentColor="Red"/>}/>
          <Route exact path="/lobby"element={<Lobby uid={uid}/>}/>
          <Route exact path="/shop"element={<Shop user={user}/>}/>
        </Routes>
      </BrowserRouter>,
      document.getElementById('root')
    );
    // ...
  } else {
    ReactDOM.render(
      <SignInScreen/>,
      document.getElementById('root')
    );
  }
});