import React from 'react';
import './styles/Loader.css';

const Loader = ({ mensaje }) => (
  <div className="loader-container">
    <div className="loader-spinner"></div>
    {mensaje && <div className="loader-message">{mensaje}</div>}
  </div>
);

export default Loader; 