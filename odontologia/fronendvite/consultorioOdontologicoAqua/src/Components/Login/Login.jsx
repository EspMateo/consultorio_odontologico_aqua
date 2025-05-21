import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/usuarios/login', {
        email,
        password,
      });

      if (res.data) {
        localStorage.setItem('userEmail', email);
        navigate('/dashboard');
      }
    } catch (err) {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">Login</h2>
        <input 
          className="login-input" 
          type="email" 
          placeholder="Correo" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <input 
          className="login-input" 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        <button className="login-btn" type="submit">Ingresar</button>
        <div className="register-link">
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
