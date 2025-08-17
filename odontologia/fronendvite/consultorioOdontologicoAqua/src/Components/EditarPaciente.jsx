import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { buildApiUrl } from '../config';
import MessageDisplay from './MessageDisplay';
import './PatientRegistration.css';

const EditarPaciente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    numero: '',
    direccion: '',
    consulta: '',
    fecha: '',
    sexo: '',
    email: '',
    edad: ''
  });
  const [displayMessage, setDisplayMessage] = useState(null);
  const [messageType, setMessageType] = useState('info');

  useEffect(() => {
    if (location.state?.paciente) {
      const paciente = location.state.paciente;
      setFormData({
        nombre: paciente.name || '',
        apellido: paciente.lastname || '',
        cedula: paciente.ci?.toString() || '',
        numero: paciente.telephone?.toString() || '',
        direccion: paciente.generalMedicalHistory || '',
        consulta: paciente.diagnosis || '',
        fecha: paciente.releaseSummary || '',
        sexo: paciente.gender || '',
        email: paciente.email || '',
        edad: paciente.age || ''
      });
    } else {
      fetchPaciente();
    }
  }, [id, location.state]);

  const fetchPaciente = async () => {
    setLoading(true);
    try {
      const response = await axios.get(buildApiUrl(`pacientes/${id}`));
      const paciente = response.data;
      setFormData({
        nombre: paciente.name || '',
        apellido: paciente.lastname || '',
        cedula: paciente.ci?.toString() || '',
        numero: paciente.telephone?.toString() || '',
        direccion: paciente.generalMedicalHistory || '',
        consulta: paciente.diagnosis || '',
        fecha: paciente.releaseSummary || '',
        sexo: paciente.gender || '',
        email: paciente.email || '',
        edad: paciente.age || ''
      });
    } catch (error) {
      setError('Error al cargar los datos del paciente');
      setDisplayMessage('Error al cargar los datos del paciente.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validaciones específicas por campo
    let validatedValue = value;
    
    if (name === 'cedula') {
      // Solo permitir números para cédula
      validatedValue = value.replace(/[^0-9]/g, '');
    } else if (name === 'numero') {
      // Solo permitir números para celular
      validatedValue = value.replace(/[^0-9]/g, '');
    } else if (name === 'nombre' || name === 'apellido') {
      // No permitir números en nombre y apellido
      validatedValue = value.replace(/[0-9]/g, '');
    } else if (name === 'edad') {
      // Solo permitir números para edad, máximo 3 dígitos
      validatedValue = value.replace(/[^0-9]/g, '').slice(0, 3);
      // Limitar edad a 150 años
      if (parseInt(validatedValue) > 150) {
        validatedValue = '150';
      }
    }
    
    setFormData(prevState => ({
      ...prevState,
      [name]: validatedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones del lado del cliente
    if (!formData.cedula || formData.cedula.length < 7) {
      setDisplayMessage('La cédula debe tener al menos 7 dígitos');
      setMessageType('error');
      return;
    }
    
    if (!formData.numero || formData.numero.length < 7) {
      setDisplayMessage('El número de celular debe tener al menos 7 dígitos');
      setMessageType('error');
      return;
    }
    
    if (!formData.nombre.trim() || !formData.apellido.trim()) {
      setDisplayMessage('El nombre y apellido son obligatorios');
      setMessageType('error');
      return;
    }
    
    // Validar que nombre y apellido no contengan números
    if (formData.nombre.match(/\d/)) {
      setDisplayMessage('El nombre no puede contener números');
      setMessageType('error');
      return;
    }
    
    if (formData.apellido.match(/\d/)) {
      setDisplayMessage('El apellido no puede contener números');
      setMessageType('error');
      return;
    }
    
    // Validar que la fecha no sea mayor a 2027
    if (formData.fecha) {
      const fechaSeleccionada = new Date(formData.fecha);
      const fechaLimite = new Date('2027-12-31');
      
      if (fechaSeleccionada > fechaLimite) {
        setDisplayMessage('La fecha no puede ser mayor al año 2027');
        setMessageType('error');
        return;
      }
    }
    
    setLoading(true);
    setError(null);
    setDisplayMessage(null);
    
    try {
      await axios.put(buildApiUrl(`pacientes/${id}`), formData);
      setDisplayMessage('Paciente actualizado exitosamente.');
      setMessageType('success');
      setTimeout(() => {
        navigate('/dashboard/pacientes');
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'Error al actualizar el paciente');
      setDisplayMessage(error.response?.data?.message || 'Error al actualizar el paciente.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleDismissMessage = () => {
    setDisplayMessage(null);
    setMessageType('info');
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="main-container">
      <MessageDisplay message={displayMessage} type={messageType} onDismiss={handleDismissMessage} />
      
      {/* Sección del Formulario de Edición */}
      <div className="form-section">
        <div className="patient-form-card">
          <div className="patient-form-header">
            <h2 className="patient-form-title">Editar Paciente</h2>
            <p className="patient-form-subtitle">Modifique los datos del paciente</p>
          </div>
          
          {error && (
            <div className="form-message error">
              ❌ {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="patient-form">
            <div className="patient-form-section">
              <h3 className="patient-form-section-title">Información Personal</h3>
              <div className="patient-form-row">
                <div className="patient-form-group">
                  <label className="patient-form-label">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="patient-form-input"
                    required
                  />
                </div>
                <div className="patient-form-group">
                  <label className="patient-form-label">Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="patient-form-input"
                    required
                  />
                </div>
                <div className="patient-form-group">
                  <label className="patient-form-label">Sexo</label>
                  <select
                    name="sexo"
                    value={formData.sexo}
                    onChange={handleChange}
                    className="patient-form-input"
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div className="patient-form-group">
                  <label className="patient-form-label">Edad</label>
                  <input 
                    type="number" 
                    name="edad" 
                    value={formData.edad || ''} 
                    onChange={handleChange} 
                    className="patient-form-input" 
                    min="0" 
                    max="150" 
                    placeholder="Opcional"
                  />
                </div>
              </div>
            </div>

            <div className="patient-form-section">
              <h3 className="patient-form-section-title">Información de Contacto</h3>
              <div className="patient-form-row">
                <div className="patient-form-group">
                  <label className="patient-form-label">Cédula</label>
                  <input
                    type="text"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    className="patient-form-input"
                    maxLength="10"
                    required
                  />
                </div>
                <div className="patient-form-group">
                  <label className="patient-form-label">Número de Teléfono</label>
                  <input
                    type="tel"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    className="patient-form-input"
                    maxLength="10"
                    required
                  />
                </div>
                <div className="patient-form-group">
                  <label className="patient-form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="patient-form-input"
                  />
                </div>
              </div>
              <div className="patient-form-row">
                <div className="patient-form-group patient-form-group-full">
                  <label className="patient-form-label">Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="patient-form-input"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="patient-form-section">
              <h3 className="patient-form-section-title">Información de la Consulta</h3>
              <div className="patient-form-row">
                <div className="patient-form-group">
                  <label className="patient-form-label">Fecha</label>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    className="patient-form-input"
                    required
                  />
                </div>
                <div className="patient-form-group patient-form-group-full">
                  <label className="patient-form-label">Consulta/Descripción</label>
                  <textarea
                    name="consulta"
                    value={formData.consulta}
                    onChange={handleChange}
                    rows="4"
                    className="patient-form-input"
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="patient-form-actions">
              <button
                type="submit"
                className="patient-form-button"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button
                type="button"
                className="patient-form-button patient-form-button-secondary"
                onClick={() => navigate('/dashboard/pacientes')}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarPaciente; 