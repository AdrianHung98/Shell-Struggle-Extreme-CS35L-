import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from '@firebase/auth';
import SignInScreen from './sign-in-screen';
import App from './routes/select-screen';
import GameCycle from './routes/game-cycle.jsx';
import Bestiary from './routes/bestiary.jsx';
import Lobby from './routes/lobby.js';
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
          <Route path="/" element={<App uid={uid} email={email}/>}/>
          <Route path="select-screen" element={<App uid={uid} email={email}/>}/>
          <Route path="bestiary" element={<Bestiary/>}/>
          <Route path="gameCycleRed" element={<GameCycle playerColor="Red" opponentColor="Blue"/>}/>
          <Route path="gameCycleBlue" element={<GameCycle playerColor="Blue" opponentColor="Red"/>}/>
          <Route path="lobby"element={<Lobby uid={uid}/>}/>
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


