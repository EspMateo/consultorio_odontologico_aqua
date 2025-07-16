import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { buildApiUrl } from '../../config';
import '../styles/Login.css';
import Loader from '../Loader';
import logoAqua from '../../assets/logo-aqua.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(buildApiUrl('usuarios/login'), {
        email,
        password,
      });

      if (res.data) {
        // Guardar el token y datos del usuario
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userId', res.data.id);
        setLoading(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    } catch (err) {
      console.error('Error en login:', err);
      if (err.response) {
        alert(err.response.data || 'Credenciales incorrectas');
      } else {
        alert('Error al conectar con el servidor');
      }
    }
  };

  return (
    <div className="login-container">
      {!loading && (
        <div className="login-logo-section">
          <img src={logoAqua} alt="Logo Aqua" className="login-logo-img" />
        </div>
      )}
      {loading ? (
        <Loader mensaje="Cargando..." />
      ) : (
        <form className="login-form" onSubmit={handleLogin}>
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
      )}
      {error && <div className="login-error">{error}</div>}
    </div>
  );
}
