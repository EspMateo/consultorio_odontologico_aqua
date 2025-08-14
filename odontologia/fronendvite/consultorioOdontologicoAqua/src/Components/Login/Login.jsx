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
  const [passwordError, setPasswordError] = useState('');
  const [buttonMessage, setButtonMessage] = useState('Ingresar');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError('');
    setButtonMessage('Iniciando sesión...');
    
    try {
      const res = await axios.post(buildApiUrl('usuarios/login'), {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (res.data) {
        // Guardar el token y datos del usuario
        localStorage.setItem('token', res.data.token || 'dummy-token');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userId', res.data.id);
        
        setButtonMessage('¡Inicio exitoso!');
        setPasswordError(''); // Limpiar cualquier error previo
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err) {
      setLoading(false);
      setButtonMessage('Ingresar');
      
      if (err.response) {
        if (err.response.status === 400) {
          setPasswordError('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
        } else {
          setPasswordError(err.response.data || 'Error en el inicio de sesión');
        }
      } else if (err.request) {
        setPasswordError('Error al conectar con el servidor. Por favor, verifica tu conexión.');
      } else {
        setPasswordError('Error al conectar con el servidor. Por favor, verifica tu conexión.');
      }
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Limpiar error cuando el usuario empiece a escribir
    if (passwordError) {
      setPasswordError('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Limpiar error cuando el usuario empiece a escribir
    if (passwordError) {
      setPasswordError('');
    }
  };

  return (
    <div className="login-container">
      {loading ? (
        <div className="loader-container">
          <Loader mensaje="Iniciando sesión..." />
        </div>
      ) : (
        <>
          <div className="login-logo-section">
            <img src={logoAqua} alt="Logo Aqua" className="login-logo-img" />
          </div>
          
          <form className="login-form" onSubmit={handleLogin}>
            <input 
              className="login-input" 
              type="email" 
              placeholder="Correo" 
              value={email} 
              onChange={handleEmailChange} 
              required 
            />
            <div className="password-container">
              <input 
                className={`login-input ${passwordError ? 'error' : ''}`}
                type="password" 
                placeholder="Contraseña" 
                value={password} 
                onChange={handlePasswordChange} 
                required 
              />
              {passwordError && (
                <div className="password-error">
                  {passwordError}
                </div>
              )}
            </div>
            <button 
              className={`login-btn ${loading ? 'loading' : ''}`}
              type="submit"
              disabled={loading}
            >
              {buttonMessage}
            </button>
            <div className="register-link">
              ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
