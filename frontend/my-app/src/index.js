import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // Importa el archivo App.js que ahora está en la misma carpeta

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);