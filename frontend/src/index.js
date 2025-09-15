// frontend/src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ReactGA from 'react-ga4'; // <-- 1. BU QATORNI IMPORT QILING

// 2. GOOGLE ANALYTICS'NI INITSALIZATSIYA QILING
// O'zingizning Measurement ID'ngizni shu yerga qo'ying
const MEASUREMENT_ID = "G-1VRMRJ1HFF"; // <-- BU YERGA O'ZINGIZNING ID'NGIZNI QO'YING

// Faqat production rejimida ishga tushiramiz
if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize(MEASUREMENT_ID);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
