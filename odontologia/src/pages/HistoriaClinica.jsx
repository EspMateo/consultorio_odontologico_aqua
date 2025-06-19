import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './HistoriaClinica.css';

const HistoriaClinica = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [formData, setFormData] = useState({
    enfermedadesActuales: '',
    medicamentos: '',
    alergias: '',
    antecedentesFamiliares: '',
    apreciacionGeneral: {
      lucido: false,
      apatico: false,
      colaborador: false,
      ambulatorio: false
    },
    examenRegional: {
      facies: false,
      faciesDetalle: '',
      cuello: false,
      cuelloDetalle: '',
      ganglios: false,
      gangliosDetalle: '',
      atm: false,
      macizoFacial: false,
      mandibula: false,
      musculos: false,
      meso: false,
      dolico: false,
      braqui: false
    },
    examenLocal: {
      continente: false,
      esfinterOralAnterior: false,
      mejillas: false,
      paladar: false,
      pisoDeBoca: false,
      esfinterOralPosterior: false,
      contenido: false,
      detalles: ''
    }
  });

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  // Función para limpiar campos vacíos antes de enviar
  const cleanFormData = (data) => {
    const cleaned = {};
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined && data[key].toString().trim() !== '') {
        cleaned[key] = data[key];
      }
    });
    return cleaned;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Limpiar datos antes de enviar
      const cleanedData = cleanFormData(formData);
      console.log('Datos a enviar:', cleanedData);
      
      const response = await axios.post('http://localhost:8080/api/historia-clinica', cleanedData);
      showNotification('success', 'Historia clínica guardada con éxito');
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      showNotification('error', 'Error al guardar la historia clínica');
      console.error('Error al guardar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="historia-clinica-container">
      {/* Notificación */}
      {notification.show && (
        <div className={`notification ${notification.type === 'success' ? 'success' : 'error'}`}>
          {notification.message}
        </div>
      )}

      <div className="historia-clinica-content">
        <div className="historia-clinica-header">
          <h2 className="historia-clinica-title">Historia Clínica</h2>
          <p className="historia-clinica-subtitle">Complete la información médica del paciente</p>
        </div>

        <form onSubmit={handleSubmit} className="historia-clinica-form">
          {/* Antecedentes Médicos */}
          <div className="form-section">
            <h3 className="section-title">Antecedentes Médicos</h3>
            <div className="form-grid">
              <div className="form-field">
                <label className="field-label">
                  Enfermedades Actuales
                </label>
                <textarea
                  value={formData.enfermedadesActuales}
                  onChange={(e) => handleInputChange('enfermedadesActuales', '', e.target.value)}
                  className="field-textarea"
                  rows="3"
                  placeholder="Describa las enfermedades actuales del paciente..."
                />
              </div>
              
              <div className="form-field">
                <label className="field-label">
                  Medicamentos
                </label>
                <textarea
                  value={formData.medicamentos}
                  onChange={(e) => handleInputChange('medicamentos', '', e.target.value)}
                  className="field-textarea"
                  rows="3"
                  placeholder="Liste los medicamentos que toma actualmente..."
                />
              </div>
              
              <div className="form-field">
                <label className="field-label">
                  Alergias
                </label>
                <textarea
                  value={formData.alergias}
                  onChange={(e) => handleInputChange('alergias', '', e.target.value)}
                  className="field-textarea"
                  rows="3"
                  placeholder="Especifique las alergias conocidas..."
                />
              </div>
              
              <div className="form-field">
                <label className="field-label">
                  Antecedentes Familiares
                </label>
                <textarea
                  value={formData.antecedentesFamiliares}
                  onChange={(e) => handleInputChange('antecedentesFamiliares', '', e.target.value)}
                  className="field-textarea"
                  rows="3"
                  placeholder="Describa antecedentes familiares relevantes..."
                />
              </div>
            </div>
          </div>

          {/* Apreciación General */}
          <div className="form-section">
            <h3 className="section-title">Apreciación General</h3>
            <div className="vertical-layout">
              <div className="checkbox-column">
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.apreciacionGeneral.lucido}
                    onChange={(e) => handleInputChange('apreciacionGeneral', 'lucido', e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-label">Lúcido</span>
                </label>
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.apreciacionGeneral.apatico}
                    onChange={(e) => handleInputChange('apreciacionGeneral', 'apatico', e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-label">Apático</span>
                </label>
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.apreciacionGeneral.colaborador}
                    onChange={(e) => handleInputChange('apreciacionGeneral', 'colaborador', e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-label">Colaborador</span>
                </label>
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.apreciacionGeneral.ambulatorio}
                    onChange={(e) => handleInputChange('apreciacionGeneral', 'ambulatorio', e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-label">Ambulatorio</span>
                </label>
              </div>
            </div>
          </div>

          {/* Examen Regional */}
          <div className="form-section">
            <h3 className="section-title">Examen Regional</h3>
            <div className="vertical-layout">
              <div className="exam-section">
                <div className="exam-group">
                  <label className="checkbox-item with-detail">
                    <input
                      type="checkbox"
                      checked={formData.examenRegional.facies}
                      onChange={(e) => handleInputChange('examenRegional', 'facies', e.target.checked)}
                      className="checkbox-input"
                    />
                    <span className="checkbox-label">Facies</span>
                  </label>
                  {formData.examenRegional.facies && (
                    <div className="detail-container">
                      <textarea
                        value={formData.examenRegional.faciesDetalle}
                        onChange={(e) => handleInputChange('examenRegional', 'faciesDetalle', e.target.value)}
                        placeholder="Detalle aquí..."
                        className="detail-textarea"
                      />
                    </div>
                  )}
                </div>

                <div className="exam-group">
                  <label className="checkbox-item with-detail">
                    <input
                      type="checkbox"
                      checked={formData.examenRegional.cuello}
                      onChange={(e) => handleInputChange('examenRegional', 'cuello', e.target.checked)}
                      className="checkbox-input"
                    />
                    <span className="checkbox-label">Cuello</span>
                  </label>
                  {formData.examenRegional.cuello && (
                    <div className="detail-container">
                      <textarea
                        value={formData.examenRegional.cuelloDetalle}
                        onChange={(e) => handleInputChange('examenRegional', 'cuelloDetalle', e.target.value)}
                        placeholder="Detalle aquí..."
                        className="detail-textarea"
                      />
                    </div>
                  )}
                </div>

                <div className="exam-group">
                  <label className="checkbox-item with-detail">
                    <input
                      type="checkbox"
                      checked={formData.examenRegional.ganglios}
                      onChange={(e) => handleInputChange('examenRegional', 'ganglios', e.target.checked)}
                      className="checkbox-input"
                    />
                    <span className="checkbox-label">Ganglios</span>
                  </label>
                  {formData.examenRegional.ganglios && (
                    <div className="detail-container">
                      <textarea
                        value={formData.examenRegional.gangliosDetalle}
                        onChange={(e) => handleInputChange('examenRegional', 'gangliosDetalle', e.target.value)}
                        placeholder="Detalle aquí..."
                        className="detail-textarea"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="checkbox-column">
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.examenRegional.atm}
                    onChange={(e) => handleInputChange('examenRegional', 'atm', e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-label">ATM</span>
                </label>
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.examenRegional.macizoFacial}
                    onChange={(e) => handleInputChange('examenRegional', 'macizoFacial', e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-label">Macizo facial</span>
                </label>
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.examenRegional.mandibula}
                    onChange={(e) => handleInputChange('examenRegional', 'mandibula', e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-label">Mandíbula</span>
                </label>
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.examenRegional.musculos}
                    onChange={(e) => handleInputChange('examenRegional', 'musculos', e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-label">Músculos</span>
                </label>
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.examenRegional.meso}
                    onChange={(e) => handleInputChange('examenRegional', 'meso', e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-label">Meso</span>
                </label>
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.examenRegional.dolico}
                    onChange={(e) => handleInputChange('examenRegional', 'dolico', e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-label">Dólico</span>
                </label>
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.examenRegional.braqui}
                    onChange={(e) => handleInputChange('examenRegional', 'braqui', e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-label">Braqui</span>
                </label>
              </div>
            </div>
          </div>

          {/* Examen Local */}
          <div className="form-section">
            <h3 className="section-title">Examen Local</h3>
            <div className="vertical-layout">
              <div className="exam-section-vertical">
                {/* Continente */}
                <div className="exam-item">
                  <div className="checkbox-wrapper">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.examenLocal.continente}
                        onChange={(e) => handleInputChange('examenLocal', 'continente', e.target.checked)}
                        className="checkbox-input"
                      />
                      <span className="checkbox-label">Continente: ¿Existen alteraciones?</span>
                    </label>
                  </div>
                  {formData.examenLocal.continente && (
                    <div className="detail-container">
                      <textarea
                        value={formData.examenLocal.continenteDetalle}
                        onChange={(e) => handleInputChange('examenLocal', 'continenteDetalle', e.target.value)}
                        placeholder="Detalle las alteraciones aquí..."
                        className="detail-textarea"
                      />
                    </div>
                  )}
                </div>

                <div className="vertical-checkboxes">
                  {/* Esfínter oral anterior */}
                  <div className="checkbox-wrapper">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.examenLocal.esfinterOralAnterior}
                        onChange={(e) => handleInputChange('examenLocal', 'esfinterOralAnterior', e.target.checked)}
                        className="checkbox-input"
                      />
                      <span className="checkbox-label">Esfínter oral anterior</span>
                    </label>
                  </div>

                  {/* Mejillas */}
                  <div className="checkbox-wrapper">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.examenLocal.mejillas}
                        onChange={(e) => handleInputChange('examenLocal', 'mejillas', e.target.checked)}
                        className="checkbox-input"
                      />
                      <span className="checkbox-label">Mejillas</span>
                    </label>
                  </div>

                  {/* Paladar */}
                  <div className="checkbox-wrapper">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.examenLocal.paladar}
                        onChange={(e) => handleInputChange('examenLocal', 'paladar', e.target.checked)}
                        className="checkbox-input"
                      />
                      <span className="checkbox-label">Paladar</span>
                    </label>
                  </div>

                  {/* Piso de boca */}
                  <div className="checkbox-wrapper">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.examenLocal.pisoDeBoca}
                        onChange={(e) => handleInputChange('examenLocal', 'pisoDeBoca', e.target.checked)}
                        className="checkbox-input"
                      />
                      <span className="checkbox-label">Piso de boca</span>
                    </label>
                  </div>

                  {/* Esfínter oral posterior */}
                  <div className="checkbox-wrapper">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.examenLocal.esfinterOralPosterior}
                        onChange={(e) => handleInputChange('examenLocal', 'esfinterOralPosterior', e.target.checked)}
                        className="checkbox-input"
                      />
                      <span className="checkbox-label">Esfínter oral posterior</span>
                    </label>
                  </div>
                </div>

                {/* Contenido */}
                <div className="exam-item">
                  <div className="checkbox-wrapper">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.examenLocal.contenido}
                        onChange={(e) => handleInputChange('examenLocal', 'contenido', e.target.checked)}
                        className="checkbox-input"
                      />
                      <span className="checkbox-label">Contenido: ¿Existen alteraciones?</span>
                    </label>
                  </div>
                  {formData.examenLocal.contenido && (
                    <div className="detail-container">
                      <textarea
                        value={formData.examenLocal.contenidoDetalle}
                        onChange={(e) => handleInputChange('examenLocal', 'contenidoDetalle', e.target.value)}
                        placeholder="Detalle las alteraciones aquí..."
                        className="detail-textarea"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Guardando...' : 'Guardar Historia Clínica'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HistoriaClinica; 