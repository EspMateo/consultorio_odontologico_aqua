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
  const [todosLosDiagnosticos, setTodosLosDiagnosticos] = useState([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);
  const [diagnosticoAEliminar, setDiagnosticoAEliminar] = useState(null);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    diagnostico: '',
    pronostico: '',
    observaciones: '',
    fechaDiagnostico: ''
  });

  // Estado para búsqueda por fecha
  const [filtroFecha, setFiltroFecha] = useState({
    fechaInicio: '',
    fechaFin: ''
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
    if (paciente && paciente.id) {
      cargarDiagnostico();
      cargarTodosLosDiagnosticos();
    }
  }, [paciente]);

  const cargarDiagnostico = async () => {
    if (!paciente || !paciente.id) return;

    try {
      setLoading(true);
      const response = await axios.get(buildApiUrl(`diagnosticos/paciente/${paciente.id}`));
      
      if (response.data && response.data.diagnosticos && response.data.diagnosticos.length > 0) {
        // Tomar el diagnóstico más reciente
        const diagnosticoReciente = response.data.diagnosticos[0];
        setDiagnosticoActual(diagnosticoReciente);
        setFormData({
          diagnostico: diagnosticoReciente.diagnostico || '',
          pronostico: diagnosticoReciente.pronostico || '',
          observaciones: diagnosticoReciente.observaciones || '',
          fechaDiagnostico: diagnosticoReciente.fechaDiagnostico || ''
        });
        setIsEditing(true);
      } else {
        setDiagnosticoActual(null);
        setIsEditing(false);
        // Resetear formulario para nuevo diagnóstico
        setFormData({
          diagnostico: '',
          pronostico: '',
          observaciones: '',
          fechaDiagnostico: ''
        });
      }
    } catch (error) {
      console.log('Error al cargar diagnóstico:', error);
      setDiagnosticoActual(null);
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const cargarTodosLosDiagnosticos = async () => {
    if (!paciente || !paciente.id) return;

    try {
      const response = await axios.get(buildApiUrl(`diagnosticos/paciente/${paciente.id}`));
      if (response.data && response.data.diagnosticos) {
        setTodosLosDiagnosticos(response.data.diagnosticos);
        console.log('Diagnósticos cargados:', response.data.diagnosticos.length);
        console.log('Fechas de los diagnósticos:', response.data.diagnosticos.map(d => ({ id: d.id, fecha: d.fechaDiagnostico })));
        
        // Si hay un diagnóstico actual, actualizarlo con los datos más recientes del backend
        if (diagnosticoActual && diagnosticoActual.id) {
          const diagnosticoActualizado = response.data.diagnosticos.find(d => d.id === diagnosticoActual.id);
          if (diagnosticoActualizado) {
            console.log('Actualizando diagnóstico actual con datos del backend:', diagnosticoActualizado);
            setDiagnosticoActual(diagnosticoActualizado);
            // Solo actualizar el formulario si no estamos en modo edición
            if (!isEditing) {
              setFormData({
                diagnostico: diagnosticoActualizado.diagnostico || '',
                pronostico: diagnosticoActualizado.pronostico || '',
                observaciones: diagnosticoActualizado.observaciones || '',
                fechaDiagnostico: diagnosticoActualizado.fechaDiagnostico || ''
              });
            }
          }
        }
      }
    } catch (error) {
      console.log('Error al cargar todos los diagnósticos:', error);
      setTodosLosDiagnosticos([]);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'fechaDiagnostico') {
      console.log('Cambiando fecha del diagnóstico a:', value);
    }
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

    if (!paciente || !paciente.id) {
      showMessage('Error: Paciente no válido', 'error');
      return;
    }

    // Validar que la fecha sea válida
    if (!formData.fechaDiagnostico) {
      showMessage('Por favor seleccione una fecha válida', 'error');
      return;
    }

    try {
      setLoading(true);
      
      // Asegurar que la fecha esté en el formato correcto
      let fechaFormateada = formData.fechaDiagnostico;
      if (fechaFormateada && typeof fechaFormateada === 'string') {
        // Si la fecha viene del input type="date", ya está en formato YYYY-MM-DD
        // Si viene de otro lugar, asegurar que esté en el formato correcto
        if (fechaFormateada.includes('T')) {
          fechaFormateada = fechaFormateada.split('T')[0];
        }
      }
      
      const diagnosticoData = {
        ...formData,
        fechaDiagnostico: fechaFormateada,
        pacienteId: paciente.id,
        usuarioId: 1 // Usuario por defecto
      };

      console.log('Datos a enviar:', diagnosticoData);
      console.log('Fecha del diagnóstico a enviar:', diagnosticoData.fechaDiagnostico);
      console.log('Tipo de fecha:', typeof diagnosticoData.fechaDiagnostico);
      console.log('Fecha formateada:', fechaFormateada);

      if (isEditing && diagnosticoActual && diagnosticoActual.id) {
        // Actualizar diagnóstico existente
        const response = await axios.put(buildApiUrl(`diagnosticos/${diagnosticoActual.id}`), diagnosticoData);
        showMessage('Diagnóstico y pronóstico actualizados exitosamente', 'success');
        
        // Actualizar el diagnóstico actual con los nuevos datos
        const diagnosticoActualizado = {
          ...diagnosticoActual,
          ...diagnosticoData
        };
        setDiagnosticoActual(diagnosticoActualizado);
        
        // Actualizar el formulario con los datos enviados
        setFormData({
          ...diagnosticoData
        });
        
        console.log('Diagnóstico actualizado en estado local:', diagnosticoActualizado);
        console.log('Formulario actualizado con fecha:', diagnosticoData.fechaDiagnostico);
      } else {
        // Crear nuevo diagnóstico
        await axios.post(buildApiUrl('diagnosticos'), diagnosticoData);
        showMessage('Diagnóstico y pronóstico guardados exitosamente', 'success');
      }
      
      // Recargar datos
      await cargarDiagnostico();
      await cargarTodosLosDiagnosticos();
      
      // Forzar actualización del historial para mostrar la fecha correcta
      setTimeout(() => {
        cargarTodosLosDiagnosticos();
      }, 100);
      
      // Mostrar el historial para que vean el nuevo diagnóstico
      setMostrarHistorial(true);
      
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
      fechaDiagnostico: ''
    });
    setIsEditing(false);
    setDiagnosticoActual(null);
    // Mostrar el historial para que vean que se está creando uno nuevo
    setMostrarHistorial(true);
  };

  const seleccionarDiagnostico = (diagnostico) => {
    console.log('Seleccionando diagnóstico con fecha:', diagnostico.fechaDiagnostico);
    setDiagnosticoActual(diagnostico);
    setFormData({
      diagnostico: diagnostico.diagnostico || '',
      pronostico: diagnostico.pronostico || '',
      observaciones: diagnostico.observaciones || '',
      fechaDiagnostico: diagnostico.fechaDiagnostico || ''
    });
    setIsEditing(true);
    setMostrarHistorial(false);
  };

  const eliminarDiagnostico = async (diagnosticoId) => {
    setDiagnosticoAEliminar(diagnosticoId);
    setMostrarConfirmacionEliminar(true);
  };

  const confirmarEliminar = async () => {
    if (!diagnosticoAEliminar) return;

    try {
      setLoading(true);
      await axios.delete(buildApiUrl(`diagnosticos/${diagnosticoAEliminar}`));
      showMessage('Diagnóstico eliminado exitosamente', 'success');
      
      // Recargar datos
      await cargarDiagnostico();
      await cargarTodosLosDiagnosticos();
      
      // Si el diagnóstico eliminado era el actual, limpiar el formulario
      if (diagnosticoActual && diagnosticoActual.id === diagnosticoAEliminar) {
        setDiagnosticoActual(null);
        setIsEditing(false);
        setFormData({
          diagnostico: '',
          pronostico: '',
          observaciones: '',
          fechaDiagnostico: ''
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Error al eliminar diagnóstico';
      showMessage(errorMsg, 'error');
    } finally {
      setLoading(false);
      setDiagnosticoAEliminar(null);
      setMostrarConfirmacionEliminar(false);
    }
  };

  const cancelarEliminar = () => {
    setDiagnosticoAEliminar(null);
    setMostrarConfirmacionEliminar(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      console.log('Formateando fecha:', dateString);
      // Parsear la fecha sin conversión de zona horaria
      const [year, month, day] = dateString.split('-');
      const fechaFormateada = `${day}/${month}/${year}`;
      console.log('Fecha formateada:', fechaFormateada);
      return fechaFormateada;
    } catch (error) {
      console.log('Error formateando fecha:', error);
      return dateString;
    }
  };

  // Función para mostrar la fecha en el formato correcto para el input date
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      // Si es una fecha en formato ISO, convertirla al formato YYYY-MM-DD
      if (dateString.includes('T')) {
        return dateString.split('T')[0];
      }
      // Si ya está en formato YYYY-MM-DD, devolverla tal como está
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateString;
      }
      // Si está en formato DD/MM/YYYY, convertirla
      if (dateString.includes('/')) {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      return dateString;
    } catch (error) {
      console.log('Error formateando fecha para input:', error);
      return '';
    }
  };

  // Si no hay paciente, mostrar mensaje de error
  if (!paciente || !paciente.id) {
    return (
      <div className="diagnostico-pronostico-overlay">
        <div className="diagnostico-pronostico-modal">
          <div className="diagnostico-pronostico-header">
            <h2>Diagnóstico y Pronóstico</h2>
            <button className="btn-cerrar" onClick={onClose}>×</button>
          </div>
          <div className="diagnostico-pronostico-content">
            <div className="error-section">
              <p>Error: No se ha seleccionado un paciente válido</p>
              <button className="btn-cerrar" onClick={onClose}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="diagnostico-pronostico-overlay">
      <div className="diagnostico-pronostico-modal">
        <div className="diagnostico-pronostico-header">
          <h2>Diagnóstico y Pronóstico</h2>
          <button className="btn-cerrar" onClick={onClose}>×</button>
        </div>

        {message && (
          <div className="message-modal-overlay">
            <div className={`message-modal ${messageType}`}>
              <div className="message-modal-content">
                <div className="message-modal-header">
                  <h3>
                    {messageType === 'success' ? '✅ Éxito' : 
                     messageType === 'error' ? '❌ Error' : 
                     'ℹ️ Información'}
                  </h3>
                  <button className="btn-cerrar" onClick={() => setMessage(null)}>
                    ×
                  </button>
                </div>
                <div className="message-modal-body">
                  <p>{message}</p>
                </div>
                <div className="message-modal-actions">
                  <button 
                    className="btn-aceptar"
                    onClick={() => setMessage(null)}
                  >
                    Aceptar
                  </button>
                </div>
              </div>
            </div>
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
            <h3>Paciente: {paciente.name || 'Sin nombre'} {paciente.lastname || 'Sin apellido'}</h3>
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
            <button 
              className="btn-historial"
              onClick={() => setMostrarHistorial(!mostrarHistorial)}
              disabled={loading}
            >
              {mostrarHistorial ? 'Ocultar Historial' : `Ver Historial (${todosLosDiagnosticos.length})`}
            </button>
          </div>

          {/* Historial de diagnósticos */}
          {mostrarHistorial && (
            <div className="historial-diagnosticos-section">
              <h4>📋 Historial de Diagnósticos ({todosLosDiagnosticos.length})</h4>
              {todosLosDiagnosticos.length > 0 ? (
                <div className="diagnosticos-lista">
                  {todosLosDiagnosticos.map((diagnostico, index) => (
                    <div 
                      key={diagnostico.id || index} 
                      className={`diagnostico-item-lista ${diagnosticoActual?.id === diagnostico.id ? 'seleccionado' : ''}`}
                      onClick={() => seleccionarDiagnostico(diagnostico)}
                    >
                      <div className="diagnostico-item-header">
                        <span className="fecha-diagnostico">
                          📅 {formatDate(diagnostico.fechaDiagnostico)}
                        </span>
                        <span className="estado-diagnostico">
                          {diagnosticoActual?.id === diagnostico.id ? '🟢 Actual' : '⚪ Histórico'}
                        </span>
                      </div>
                      <div className="diagnostico-item-content">
                        <p><strong>Diagnóstico:</strong> {diagnostico.diagnostico?.substring(0, 100)}...</p>
                        <p><strong>Pronóstico:</strong> {diagnostico.pronostico?.substring(0, 100)}...</p>
                        <p><strong>Fecha original:</strong> {diagnostico.fechaDiagnostico}</p>
                      </div>
                      <div className="diagnostico-item-actions">
                        <button 
                          className="btn-seleccionar"
                          onClick={(e) => {
                            e.stopPropagation();
                            seleccionarDiagnostico(diagnostico);
                          }}
                        >
                          👁️ Ver Detalles
                        </button>
                        <button 
                          className="btn-eliminar"
                          onClick={(e) => {
                            e.stopPropagation();
                            eliminarDiagnostico(diagnostico.id);
                          }}
                          disabled={loading}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-diagnosticos-message">
                  <p>No hay diagnósticos registrados para este paciente.</p>
                  <p>¡Crea el primer diagnóstico usando el formulario!</p>
                </div>
              )}
            </div>
          )}

          {/* Formulario de diagnóstico y pronóstico */}
          <div className="form-section">
            <div className="form-group">
              <label>Fecha del Diagnóstico *</label>
              <input
                type="date"
                value={formData.fechaDiagnostico}
                onChange={(e) => handleInputChange('fechaDiagnostico', e.target.value)}
                className="form-input"
                required
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
                  <span className="fecha-original">
                    (Original: {diagnosticoActual.fechaDiagnostico})
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

      {/* Modal de Confirmación de Eliminación */}
      {mostrarConfirmacionEliminar && (
        <div className="confirmacion-eliminar-overlay">
          <div className="confirmacion-eliminar-modal">
            <h3>Confirmar Eliminación</h3>
            <p>¿Está seguro de que desea eliminar este diagnóstico? Esta acción no se puede deshacer.</p>
            <div className="confirmacion-botones">
              <button className="btn-confirmar-eliminar" onClick={confirmarEliminar} disabled={loading}>
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
              <button className="btn-cancelar-eliminar" onClick={cancelarEliminar} disabled={loading}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticoPronostico;