import ReactDOM from 'react-dom/client';
import './index.css';
import { Home } from './components/communities/Home';
import React from 'react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);