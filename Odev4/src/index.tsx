import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthContextProvider } from './auth/AuthContextProvider';

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);