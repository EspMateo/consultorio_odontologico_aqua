import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import MessageDisplay from './MessageDisplay';
import './styles/HistoriaClinica.css';

const HistoriaClinica = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paciente, setPaciente] = useState(null);
  const [displayMessage, setDisplayMessage] = useState(null);
  const [messageType, setMessageType] = useState('info');

  useEffect(() => {
    if (location.state?.paciente) {
      setPaciente(location.state.paciente);
      setLoading(false);
    } else {
      fetchPaciente();
    }
  }, [id, location.state]);

  const fetchPaciente = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/pacientes/${id}`);
      setPaciente(response.data);
    } catch (error) {
      console.error('Error al cargar paciente:', error);
      setError('Error al cargar los datos del paciente');
      setDisplayMessage('Error al cargar los datos del paciente.');
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
  if (error) return <div className="error-message">{error}</div>;
  if (!paciente) return <p>No se encontró el paciente</p>;

  return (
    <div className="historia-clinica-container">
      <MessageDisplay message={displayMessage} type={messageType} onDismiss={handleDismissMessage} />
      <div className="historia-clinica-card">
        <div className="historia-clinica-header">
          <h2 className="historia-clinica-title">Historia Clínica</h2>
          <p className="historia-clinica-subtitle">
            {paciente.name} {paciente.lastname} - CI: {paciente.ci}
          </p>
        </div>

        <div className="historia-clinica-section">
          <h3 className="historia-clinica-section-title">Información Personal</h3>
          <div className="historia-clinica-grid">
            <div className="historia-clinica-item">
              <label>Nombre:</label>
              <span>{paciente.name}</span>
            </div>
            <div className="historia-clinica-item">
              <label>Apellido:</label>
              <span>{paciente.lastname}</span>
            </div>
            <div className="historia-clinica-item">
              <label>Cédula:</label>
              <span>{paciente.ci}</span>
            </div>
            <div className="historia-clinica-item">
              <label>Sexo:</label>
              <span>{paciente.gender}</span>
            </div>
          </div>
        </div>

        <div className="historia-clinica-section">
          <h3 className="historia-clinica-section-title">Información de Contacto</h3>
          <div className="historia-clinica-grid">
            <div className="historia-clinica-item">
              <label>Teléfono:</label>
              <span>{paciente.telephone}</span>
            </div>
            <div className="historia-clinica-item">
              <label>Email:</label>
              <span>{paciente.email || 'No registrado'}</span>
            </div>
            <div className="historia-clinica-item full-width">
              <label>Dirección:</label>
              <span>{paciente.generalMedicalHistory}</span>
            </div>
          </div>
        </div>

        <div className="historia-clinica-section">
          <h3 className="historia-clinica-section-title">Información Médica</h3>
          <div className="historia-clinica-grid">
            <div className="historia-clinica-item full-width">
              <label>Diagnóstico:</label>
              <span>{paciente.diagnosis || 'No registrado'}</span>
            </div>
            <div className="historia-clinica-item full-width">
              <label>Medicación:</label>
              <span>{paciente.medication || 'No registrada'}</span>
            </div>
            <div className="historia-clinica-item full-width">
              <label>Historial Médico General:</label>
              <span>{paciente.generalMedicalHistory || 'No registrado'}</span>
            </div>
            <div className="historia-clinica-item full-width">
              <label>Historial Dental:</label>
              <span>{paciente.dentalHistory || 'No registrado'}</span>
            </div>
          </div>
        </div>

        <div className="historia-clinica-actions">
          <button
            className="historia-clinica-button historia-clinica-button-secondary"
            onClick={() => navigate('/dashboard/pacientes')}
          >
            Volver a la lista de pacientes
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoriaClinica; 