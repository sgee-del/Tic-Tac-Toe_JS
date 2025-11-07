import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);