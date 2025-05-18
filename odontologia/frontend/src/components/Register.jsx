import React, { useState } from 'react';

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
      const response = await fetch('http://localhost:8080/api/usuarios/register', {
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
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Nombre" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
