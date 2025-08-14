import React, { useState, useEffect, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../../config';
import Loader from '../Loader';
import '../styles/Register.css';

function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [buttonMessage, setButtonMessage] = useState('Registrarse');
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
    
    // Limpiar errores cuando el usuario escriba
    if (passwordError) {
      setPasswordError('');
    }
    
    // Verificar email en tiempo real con debounce
    if (name === 'email') {
      // Limpiar el timeout anterior
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      // Establecer un nuevo timeout
      debounceRef.current = setTimeout(() => {
        if (value) {
          checkEmailExists(value);
        } else {
          setEmailExists(false);
        }
      }, 500); // Esperar 500ms después de que el usuario deje de escribir
    }
  };

  const checkEmailExists = async (email) => {
    if (!email || email.length < 3) {
      setEmailExists(false);
      return;
    }
    
    // Validar formato de email antes de hacer la petición
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailExists(false);
      return;
    }
    
    setCheckingEmail(true);
    try {
      const response = await axios.get(buildApiUrl(`usuarios/check-email/${email}`));
      setEmailExists(response.data.exists);
    } catch (error) {
      setEmailExists(false);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError('');
    setButtonMessage('Registrarse');
    
    // Validaciones del lado del cliente
    if (!form.email || !form.password || !form.name) {
      setPasswordError('Por favor, completa todos los campos');
      setButtonMessage('Registrarse');
      setLoading(false);
      return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setPasswordError('Por favor, ingresa un email válido');
      setButtonMessage('Registrarse');
      setLoading(false);
      return;
    }
    
    // Verificar si el email ya existe antes de enviar
    if (emailExists) {
      setPasswordError('⚠️ Este email ya está registrado. Por favor, utiliza otro email o inicia sesión.');
      setButtonMessage('Registrarse');
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post(buildApiUrl('usuarios/register'), form, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

            if (response.data) {
        setButtonMessage('¡Usuario registrado con éxito!');
        setPasswordError(''); // Limpiar errores
        // Limpiar el formulario después del registro exitoso
        setForm({
          email: '',
          password: '',
          name: ''
        });
        setEmailExists(false);
        
        // Resetear el botón después de 2 segundos
        setTimeout(() => {
          setButtonMessage('Registrarse');
        }, 2000);
        navigate("/");
      }
         } catch (err) {
       setButtonMessage('Registrarse');
       
       if (err.response) {
         const errorMessage = err.response.data;
        
        // Manejar errores específicos
        if (errorMessage.includes('email ya está registrado')) {
          setPasswordError('⚠️ Este email ya está registrado. Por favor, utiliza otro email o inicia sesión.');
          setEmailExists(true); // Actualizar el estado local
        } else if (errorMessage.includes('obligatorio')) {
          setPasswordError(`⚠️ ${errorMessage}`);
                 } else {
           setPasswordError(`Error: ${errorMessage || 'No se pudo registrar el usuario'}`);
         }
       } else if (err.request) {
         setPasswordError('Error al conectar con el servidor. Por favor, asegúrate de que el servidor esté corriendo.');
       } else {
         setPasswordError('Error al conectar con el servidor. Por favor, verifica tu conexión.');
       }
    } finally {
      setLoading(false);
    }
  };

  // Limpiar timeout cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="register-container">
      {loading ? (
        <div className="loader-container">
          <Loader mensaje="Registrando usuario..." />
        </div>
      ) : (
        <>
          <h2 className="register-title">Registro</h2>
          
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input 
                className={`register-input ${emailExists ? 'error' : ''}`}
                name="name" 
                placeholder="Nombre" 
                value={form.name}
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="input-group">
              <input 
                className={`register-input ${emailExists ? 'error' : ''}`}
                name="email" 
                placeholder="Email" 
                value={form.email}
                onChange={handleChange} 
                required 
              />
              {checkingEmail && <div className="checking-email">Verificando...</div>}
              {emailExists && form.email && (
                <div className="email-error">
                  ⚠️ Este email ya está registrado
                </div>
              )}
            </div>
            
            <div className="input-group">
              <div className="password-container">
                <input 
                  className={`register-input ${passwordError ? 'error' : ''}`}
                  name="password" 
                  type="password" 
                  placeholder="Contraseña" 
                  value={form.password}
                  onChange={handleChange} 
                  required 
                />
                {passwordError && (
                  <div className="password-error">
                    {passwordError}
                  </div>
                )}
              </div>
            </div>
            
            <button 
              className={`register-btn ${loading ? 'loading' : ''}`}
              type="submit"
              disabled={loading || emailExists}
            >
              {buttonMessage}
            </button>
            <div className="login-link">
              ¿Ya tienes una cuenta? <Link to="/">Inicia sesión aquí</Link>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default Register;
