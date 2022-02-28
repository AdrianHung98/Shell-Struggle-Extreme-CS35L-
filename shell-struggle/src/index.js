import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './index.css';

import App from './select-screen';
import GameCycle from './routes/gameCycle.jsx';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>}/>
      <Route path="gameCycle" element={<GameCycle/>}/>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

