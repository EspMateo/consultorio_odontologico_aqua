import React, { useState } from 'react';
import axios from 'axios';
import './PatientRegistration.css';

const steps = [
  { key: 'personal', label: 'Información Personal' },
  { key: 'contacto', label: 'Información de Contacto' },
  { key: 'consulta', label: 'Información de la Consulta' },
];

const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    numero: '',
    direccion: '',
    consulta: '',
    fecha: '',
    sexo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentStep, setCurrentStep] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:8080/api/pacientes/registro', formData);
      
      if (response.data) {
        // Limpiar el formulario después de un registro exitoso
        setFormData({
          nombre: '',
          apellido: '',
          cedula: '',
          numero: '',
          direccion: '',
          consulta: '',
          fecha: '',
          sexo: ''
        });
        alert('Paciente registrado exitosamente');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al registrar el paciente');
      alert('Error al registrar el paciente');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Para navegación entre pasos (opcional, puedes dejarlo fijo en 0 si quieres todo el formulario junto)
  // const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  // const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="patient-form-container">
      <div className="patient-form-card">
        <div className="patient-form-header">
          <h2 className="patient-form-title">Registro de Paciente</h2>
          <p className="patient-form-subtitle">Complete el formulario con los datos del paciente</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="patient-form">
          <div className="patient-form-section">
            <h3 className="patient-form-section-title">Información Personal</h3>
            <div className="patient-form-row">
              <div className="patient-form-group">
                <label className="patient-form-label">Nombre</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="patient-form-input" required />
              </div>
              <div className="patient-form-group">
                <label className="patient-form-label">Apellido</label>
                <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} className="patient-form-input" required />
              </div>
              <div className="patient-form-group">
                <label className="patient-form-label">Sexo</label>
                <select name="sexo" value={formData.sexo} onChange={handleChange} className="patient-form-input" required>
                  <option value="">Seleccione...</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>
          </div>
          <div className="patient-form-section">
            <h3 className="patient-form-section-title">Información de Contacto</h3>
            <div className="patient-form-row">
              <div className="patient-form-group">
                <label className="patient-form-label">Cédula</label>
                <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} className="patient-form-input" required />
              </div>
              <div className="patient-form-group">
                <label className="patient-form-label">Número de Teléfono</label>
                <input type="tel" name="numero" value={formData.numero} onChange={handleChange} className="patient-form-input" required />
              </div>
              <div className="patient-form-group patient-form-group-full">
                <label className="patient-form-label">Dirección</label>
                <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} className="patient-form-input" required />
              </div>
            </div>
          </div>
          <div className="patient-form-section">
            <h3 className="patient-form-section-title">Información de la Consulta</h3>
            <div className="patient-form-row">
              <div className="patient-form-group">
                <label className="patient-form-label">Fecha</label>
                <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} className="patient-form-input" required />
              </div>
              <div className="patient-form-group patient-form-group-full">
                <label className="patient-form-label">Consulta</label>
                <textarea name="consulta" value={formData.consulta} onChange={handleChange} rows="4" className="patient-form-input" required></textarea>
              </div>
            </div>
          </div>
          <div className="patient-form-actions">
            <button 
              type="submit" 
              className="patient-form-button"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrar Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistration; 