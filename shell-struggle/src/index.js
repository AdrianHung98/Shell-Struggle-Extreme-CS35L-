import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from '@firebase/auth';
import './index.css';
import SignInScreen from './sign-in-screen';
import App from './routes/select-screen';
import GameCycle from './routes/game-cycle.jsx';
import Bestiary from './routes/bestiary.jsx';

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


