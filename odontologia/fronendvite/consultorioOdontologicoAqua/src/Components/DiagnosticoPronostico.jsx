import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { buildApiUrl } from '../config';
import './styles/DiagnosticoPronostico.css';

const DiagnosticoPronostico = ({ paciente, onClose }) => {
  const [diagnosticoActual, setDiagnosticoActual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('info');
  const [isEditing, setIsEditing] = useState(false);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    diagnostico: '',
    pronostico: '',
    observaciones: '',
    fechaDiagnostico: new Date().toISOString().split('T')[0]
  });

  // Función para mostrar mensajes
  const showMessage = (msg, type = 'info', duration = 5000) => {
    setMessage(msg);
    setMessageType(type);
    
    if (duration > 0) {
      setTimeout(() => {
        setMessage(null);
        setMessageType('info');
      }, duration);
    }
  };

  // Cargar diagnóstico actual del paciente
  useEffect(() => {
    if (paciente?.id) {
      cargarDiagnostico();
    }
  }, [paciente]);

  const cargarDiagnostico = async () => {
    try {
      setLoading(true);
      const response = await axios.get(buildApiUrl(`diagnostico/paciente/${paciente.id}`));
      
      if (response.data) {
        setDiagnosticoActual(response.data);
        setFormData({
          diagnostico: response.data.diagnostico || '',
          pronostico: response.data.pronostico || '',
          observaciones: response.data.observaciones || '',
          fechaDiagnostico: response.data.fechaDiagnostico || new Date().toISOString().split('T')[0]
        });
        setIsEditing(true);
      } else {
        setDiagnosticoActual(null);
        setIsEditing(false);
      }
      
      console.log('Diagnóstico cargado:', response.data);
    } catch (error) {
      console.error('Error al cargar diagnóstico:', error);
      // Si no existe diagnóstico, no mostrar error
      if (error.response?.status !== 404) {
        showMessage('Error al cargar diagnóstico', 'error');
      }
      setDiagnosticoActual(null);
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGuardar = async () => {
    if (!formData.diagnostico.trim() || !formData.pronostico.trim()) {
      showMessage('Por favor complete el diagnóstico y pronóstico', 'error');
      return;
    }

    try {
      setLoading(true);
      const diagnosticoData = {
        ...formData,
        pacienteId: paciente.id,
        usuarioId: 1 // Usuario por defecto
      };

      if (isEditing && diagnosticoActual) {
        // Actualizar diagnóstico existente
        const response = await axios.put(buildApiUrl(`diagnostico/${diagnosticoActual.id}`), diagnosticoData);
        showMessage('Diagnóstico y pronóstico actualizados exitosamente', 'success');
      } else {
        // Crear nuevo diagnóstico
        const response = await axios.post(buildApiUrl('diagnostico'), diagnosticoData);
        showMessage('Diagnóstico y pronóstico guardados exitosamente', 'success');
      }
      
      // Recargar datos
      await cargarDiagnostico();
      
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Error al guardar diagnóstico y pronóstico';
      showMessage(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoDiagnostico = () => {
    setFormData({
      diagnostico: '',
      pronostico: '',
      observaciones: '',
      fechaDiagnostico: new Date().toISOString().split('T')[0]
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="diagnostico-pronostico-overlay">
      <div className="diagnostico-pronostico-modal">
        <div className="diagnostico-pronostico-header">
          <h2>Diagnóstico y Pronóstico</h2>
          <button className="btn-cerrar" onClick={onClose}>
            ×
          </button>
        </div>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="diagnostico-pronostico-content">
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Cargando...</p>
            </div>
          )}

          {/* Información del paciente */}
          <div className="paciente-info-section">
            <h3>Paciente: {paciente?.name} {paciente?.lastname}</h3>
          </div>

          {/* Botón para nuevo diagnóstico */}
          <div className="nuevo-diagnostico-section">
            <button 
              className="btn-nuevo-diagnostico"
              onClick={handleNuevoDiagnostico}
              disabled={loading}
            >
              + Nuevo Diagnóstico
            </button>
          </div>

          {/* Formulario de diagnóstico y pronóstico */}
          <div className="form-section">
            <div className="form-group">
              <label>Fecha del Diagnóstico</label>
              <input
                type="date"
                value={formData.fechaDiagnostico}
                onChange={(e) => handleInputChange('fechaDiagnostico', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Diagnóstico Actual *</label>
              <textarea
                value={formData.diagnostico}
                onChange={(e) => handleInputChange('diagnostico', e.target.value)}
                placeholder="Describa el diagnóstico actual del paciente"
                rows="6"
                className="form-textarea diagnostico-textarea"
              />
            </div>

            <div className="form-group">
              <label>Pronóstico *</label>
              <textarea
                value={formData.pronostico}
                onChange={(e) => handleInputChange('pronostico', e.target.value)}
                placeholder="Describa el pronóstico que se le dará al paciente"
                rows="6"
                className="form-textarea pronostico-textarea"
              />
            </div>

            <div className="form-group">
              <label>Observaciones Adicionales</label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                placeholder="Observaciones adicionales sobre el diagnóstico y pronóstico"
                rows="4"
                className="form-textarea"
              />
            </div>

            <div className="form-actions">
              <button 
                className="btn-guardar"
                onClick={handleGuardar}
                disabled={loading}
              >
                {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar')}
              </button>
              <button 
                className="btn-cancelar"
                onClick={onClose}
                disabled={loading}
              >
                Cerrar
              </button>
            </div>
          </div>

          {/* Historial de diagnósticos */}
          {diagnosticoActual && (
            <div className="diagnostico-actual-section">
              <h3>Diagnóstico Actual</h3>
              <div className="diagnostico-card">
                <div className="diagnostico-header">
                  <span className="fecha-diagnostico">
                    Fecha: {formatDate(diagnosticoActual.fechaDiagnostico)}
                  </span>
                </div>
                <div className="diagnostico-content">
                  <div className="diagnostico-item">
                    <h4>Diagnóstico:</h4>
                    <p>{diagnosticoActual.diagnostico}</p>
                  </div>
                  <div className="diagnostico-item">
                    <h4>Pronóstico:</h4>
                    <p>{diagnosticoActual.pronostico}</p>
                  </div>
                  {diagnosticoActual.observaciones && (
                    <div className="diagnostico-item">
                      <h4>Observaciones:</h4>
                      <p>{diagnosticoActual.observaciones}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticoPronostico; 