import React from 'react';
import './styles/Loader.css';
import logoAqua from '../assets/logo-aqua.png';

const Loader = ({ mensaje }) => (
  <div className="loader-container">
    <img src={logoAqua} alt="Logo Aqua" className="loader-logo-img" />
    <div className="loader-spinner"></div>
    {mensaje && <div className="loader-message">{mensaje}</div>}
  </div>
);

export default Loader; 