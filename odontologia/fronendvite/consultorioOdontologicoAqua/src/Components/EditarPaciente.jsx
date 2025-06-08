import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import MessageDisplay from './MessageDisplay';
import './styles/EditarPaciente.css';

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
    email: ''
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
        email: paciente.email || ''
      });
    } else {
      fetchPaciente();
    }
  }, [id, location.state]);

  const fetchPaciente = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/pacientes/${id}`);
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
        email: paciente.email || ''
      });
    } catch (error) {
      console.error('Error al cargar paciente:', error);
      setError('Error al cargar los datos del paciente');
      setDisplayMessage('Error al cargar los datos del paciente.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

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
    setDisplayMessage(null);
    
    try {
      await axios.put(`http://localhost:8080/api/pacientes/${id}`, formData);
      setDisplayMessage('Paciente actualizado exitosamente.');
      setMessageType('success');
      setTimeout(() => {
        navigate('/dashboard/pacientes');
      }, 1500);
    } catch (error) {
      console.error('Error al actualizar paciente:', error);
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
    <div className="editar-paciente-container">
      <MessageDisplay message={displayMessage} type={messageType} onDismiss={handleDismissMessage} />
      <div className="editar-paciente-card">
        <div className="editar-paciente-header">
          <h2 className="editar-paciente-title">Editar Paciente</h2>
          <p className="editar-paciente-subtitle">Modifique los datos del paciente</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="editar-paciente-form">
          <div className="editar-paciente-section">
            <h3 className="editar-paciente-section-title">Información Personal</h3>
            <div className="editar-paciente-row">
              <div className="editar-paciente-group">
                <label className="editar-paciente-label">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="editar-paciente-input"
                  required
                />
              </div>
              <div className="editar-paciente-group">
                <label className="editar-paciente-label">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="editar-paciente-input"
                  required
                />
              </div>
              <div className="editar-paciente-group">
                <label className="editar-paciente-label">Sexo</label>
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className="editar-paciente-input"
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>
          </div>

          <div className="editar-paciente-section">
            <h3 className="editar-paciente-section-title">Información de Contacto</h3>
            <div className="editar-paciente-row">
              <div className="editar-paciente-group">
                <label className="editar-paciente-label">Cédula</label>
                <input
                  type="text"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  className="editar-paciente-input"
                  required
                />
              </div>
              <div className="editar-paciente-group">
                <label className="editar-paciente-label">Número de Teléfono</label>
                <input
                  type="tel"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  className="editar-paciente-input"
                  required
                />
              </div>
              <div className="editar-paciente-group">
                <label className="editar-paciente-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="editar-paciente-input"
                />
              </div>
            </div>
            <div className="editar-paciente-row">
              <div className="editar-paciente-group editar-paciente-group-full">
                <label className="editar-paciente-label">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="editar-paciente-input"
                  required
                />
              </div>
            </div>
          </div>

          <div className="editar-paciente-section">
            <h3 className="editar-paciente-section-title">Información de la Consulta</h3>
            <div className="editar-paciente-row">
              <div className="editar-paciente-group">
                <label className="editar-paciente-label">Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  className="editar-paciente-input"
                  required
                />
              </div>
              <div className="editar-paciente-group editar-paciente-group-full">
                <label className="editar-paciente-label">Consulta</label>
                <textarea
                  name="consulta"
                  value={formData.consulta}
                  onChange={handleChange}
                  rows="4"
                  className="editar-paciente-input"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <div className="editar-paciente-actions">
            <button
              type="submit"
              className="editar-paciente-button"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
              type="button"
              className="editar-paciente-button editar-paciente-button-secondary"
              onClick={() => navigate('/dashboard/pacientes')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarPaciente; 