import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './index.css';
import SignInScreen from './sign-in-screen';
import App from './routes/select-screen';
import GameCycle from './routes/game-cycle.jsx';
import Bestiary from './routes/bestiary.jsx';
import './database'

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<SignInScreen/>}/>
      <Route path="select-screen" element={<App/>}/>
      <Route path="gameCycle" element={<GameCycle/>}/>
      <Route path="bestiary" element={<Bestiary/>}/>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

