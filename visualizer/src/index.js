import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TensorDecomposition from './TensorDecomposition.js';
//import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <TensorDecomposition />

    {/* This is the Burer-Monteiro visualizer! */}
  </React.StrictMode>,
  document.getElementById('root')
);
