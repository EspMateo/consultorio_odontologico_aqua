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
  const [emailError, setEmailError] = useState('');
  const [buttonMessage, setButtonMessage] = useState('Ingresar');
  const navigate = useNavigate();

  // Función para validar email
  const validateEmail = (email) => {
    // Regex básico para formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      return 'Formato de email inválido';
    }

    // Validar dominios específicos
    const domain = email.split('@')[1]?.toLowerCase();
    const validDomains = [
      'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 
      'live.com', 'msn.com', 'icloud.com', 'protonmail.com',
      'aol.com', 'yandex.com', 'mail.com', 'gmx.com'
    ];

    if (!validDomains.includes(domain)) {
      return 'Dominio de email no soportado. Use Gmail, Hotmail, Outlook u otros proveedores conocidos.';
    }

    return null; // Email válido
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validar email antes de enviar
    const emailValidation = validateEmail(email);
    if (emailValidation) {
      setEmailError(emailValidation);
      return;
    }

    setLoading(true);
    setPasswordError('');
    setEmailError('');
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
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (passwordError) {
      setPasswordError('');
    }
    if (emailError) {
      setEmailError('');
    }

    // Validar email en tiempo real (solo si hay contenido)
    if (newEmail && newEmail.length > 3) {
      const validation = validateEmail(newEmail);
      if (validation) {
        setEmailError(validation);
      } else {
        setEmailError('');
      }
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
        <Loader mensaje="Iniciando sesión..." />
      ) : (
        <>
          <div className="login-logo-section">
            <img src={logoAqua} alt="Logo Aqua" className="login-logo-img" />
          </div>
          
          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <input 
                className={`login-input ${emailError ? 'error' : ''}`} 
                type="email" 
                placeholder="Correo electrónico" 
                value={email} 
                onChange={handleEmailChange} 
                required 
              />
              {emailError && (
                <div className="email-error">
                  {emailError}
                </div>
              )}
            </div>
            
            <div className="input-group">
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
              disabled={loading || !!emailError}
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
