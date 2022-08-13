import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';

import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import { SocketProvider } from './contexts/SocketContext';

axios.defaults.baseURL =
  process.env.NODE_ENV === 'development'
    ? `http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/api`
    : `https://${process.env.REACT_APP_SERVER_URL}/api`;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <SocketProvider>
      <App />
    </SocketProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
