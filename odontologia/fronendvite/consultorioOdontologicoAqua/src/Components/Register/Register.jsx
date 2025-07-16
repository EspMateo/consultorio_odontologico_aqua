import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { buildApiUrl } from '../../config';
import '../styles/Register.css';

function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(buildApiUrl('usuarios/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        alert('Usuario registrado con éxito');
      } else {
        const data = await response.json();
        alert(`Error: ${data.message || 'No se pudo registrar'}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al conectar con el servidor. Por favor, asegúrate de que el servidor esté corriendo.');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Registro</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input className="register-input" name="name" placeholder="Nombre" onChange={handleChange} required />
        <input className="register-input" name="email" placeholder="Email" onChange={handleChange} required />
        <input className="register-input" name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
        <button className="register-btn" type="submit">Registrarse</button>
        <div className="login-link">
          ¿Ya tienes una cuenta? <Link to="/">Inicia sesión aquí</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
