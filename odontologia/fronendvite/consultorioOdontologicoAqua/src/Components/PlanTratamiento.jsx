import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { buildApiUrl } from '../config';
import './styles/PlanTratamiento.css';

const PlanTratamiento = ({ paciente, onClose }) => {
  const [showNuevoTratamiento, setShowNuevoTratamiento] = useState(false);
  const [showEditarTratamiento, setShowEditarTratamiento] = useState(false);
  const [showDetallesTratamiento, setShowDetallesTratamiento] = useState(false);
  const [tratamientoSeleccionado, setTratamientoSeleccionado] = useState(null);
  const [tratamientos, setTratamientos] = useState([]);
  const [tratamientoActual, setTratamientoActual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('info');

  // Estado para el formulario de nuevo tratamiento
  const [nuevoTratamiento, setNuevoTratamiento] = useState({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    seguimiento: '',
    duracion: ''
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

  // Cargar tratamientos del paciente
  useEffect(() => {
    if (paciente?.id) {
      cargarTratamientos();
    }
  }, [paciente]);

  const cargarTratamientos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(buildApiUrl(`tratamientos/paciente/${paciente.id}`));
      
      // El backend devuelve { tratamientos: [...], total: ... }
      const tratamientosData = response.data.tratamientos || response.data;
      setTratamientos(tratamientosData);
      
      // Buscar tratamientos activos
      if (tratamientosData && tratamientosData.length > 0) {
        const activos = tratamientosData.filter(t => t.activo);
        if (activos.length > 0) {
          setTratamientoActual(activos[0]); // Mostrar el primero como principal
        } else {
          setTratamientoActual(null);
        }
      } else {
        setTratamientoActual(null);
      }
    } catch (error) {
      showMessage('Error al cargar tratamientos', 'error');
      setTratamientos([]);
      setTratamientoActual(null);
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoTratamiento = () => {
    setShowNuevoTratamiento(true);
    setNuevoTratamiento({
      nombre: '',
      descripcion: '',
      fechaInicio: '',
      fechaFin: '',
      seguimiento: '',
      duracion: ''
    });
  };

  const handleEditarTratamiento = () => {
    if (tratamientoActual) {
      setNuevoTratamiento({
        nombre: tratamientoActual.nombre || '',
        descripcion: tratamientoActual.descripcion || '',
        fechaInicio: tratamientoActual.fechaInicio || '',
        fechaFin: tratamientoActual.fechaFin || '',
        seguimiento: tratamientoActual.seguimiento || '',
        duracion: tratamientoActual.duracion || ''
      });
      setShowEditarTratamiento(true);
    }
  };

  const handleInputChange = (field, value) => {
    setNuevoTratamiento(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGuardarTratamiento = async () => {
    if (!nuevoTratamiento.nombre || !nuevoTratamiento.descripcion) {
      showMessage('Por favor complete los campos obligatorios', 'error');
      return;
    }

    try {
      setLoading(true);
      const tratamientoData = {
        ...nuevoTratamiento,
        pacienteId: paciente.id,
        activo: true
      };

      const response = await axios.post(buildApiUrl('tratamientos'), tratamientoData);
      
      showMessage('Tratamiento creado exitosamente', 'success');
      setShowNuevoTratamiento(false);
      
      // Recargar tratamientos
      await cargarTratamientos();
      
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Error al crear tratamiento';
      showMessage(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleActualizarTratamiento = async () => {
    if (!nuevoTratamiento.nombre || !nuevoTratamiento.descripcion) {
      showMessage('Por favor complete los campos obligatorios', 'error');
      return;
    }

    try {
      setLoading(true);
      const tratamientoData = {
        ...nuevoTratamiento,
        pacienteId: paciente.id,
        activo: true
      };

      const response = await axios.put(buildApiUrl(`tratamientos/${tratamientoActual.id}`), tratamientoData);
      
      showMessage('Tratamiento actualizado exitosamente', 'success');
      setShowEditarTratamiento(false);
      
      // Recargar tratamientos
      await cargarTratamientos();
      
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Error al actualizar tratamiento';
      showMessage(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCompletarTratamiento = async (tratamiento) => {
    if (!tratamiento) return;

    try {
      setLoading(true);
      const response = await axios.put(buildApiUrl(`tratamientos/${tratamiento.id}/desactivar`));
      
      showMessage('Tratamiento marcado como completado exitosamente', 'success');
      
      // Recargar tratamientos
      await cargarTratamientos();
      
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Error al completar tratamiento';
      showMessage(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    setShowNuevoTratamiento(false);
    setShowEditarTratamiento(false);
    setShowDetallesTratamiento(false);
    setTratamientoSeleccionado(null);
    setNuevoTratamiento({
      nombre: '',
      descripcion: '',
      fechaInicio: '',
      fechaFin: '',
      seguimiento: '',
      duracion: ''
    });
  };

  const handleVerDetallesTratamiento = (tratamiento) => {
    setTratamientoSeleccionado(tratamiento);
    setShowDetallesTratamiento(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="plan-tratamiento-overlay">
      <div className="plan-tratamiento-modal">
        <div className="plan-tratamiento-header">
          <h2>Plan de Tratamiento</h2>
          <button className="btn-cerrar" onClick={onClose}>
            ×
          </button>
        </div>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="plan-tratamiento-content">
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Cargando...</p>
            </div>
          )}

          {/* Botón para crear nuevo tratamiento */}
          <div className="nuevo-tratamiento-section">
            <button 
              className="btn-nuevo-tratamiento"
              onClick={handleNuevoTratamiento}
              disabled={loading}
            >
              + Crear Nuevo Tratamiento
            </button>
          </div>

          {/* Panel de Tratamientos Activos */}
          <div className="tratamiento-actual-section">
            <h3>Tratamientos Activos</h3>
            {tratamientos.filter(t => t.activo).length > 0 ? (
              <div className="tratamientos-activos-lista">
                {tratamientos.filter(t => t.activo).map((tratamiento, index) => (
                  <div key={tratamiento.id} className="tratamiento-actual-card">
                    <div className="tratamiento-header">
                      <h4>{tratamiento.nombre}</h4>
                      <div className="tratamiento-header-actions">
                        <span className="estado activo">
                          Activo
                        </span>
                        <button 
                          className="btn-editar-tratamiento"
                          onClick={() => {
                            setTratamientoActual(tratamiento);
                            handleEditarTratamiento();
                          }}
                          disabled={loading}
                        >
                          ✏️ Editar
                        </button>
                        <button 
                          className="btn-completar-tratamiento"
                          onClick={() => handleCompletarTratamiento(tratamiento)}
                          disabled={loading}
                        >
                          ✅ Completar
                        </button>
                      </div>
                    </div>
                    <div className="tratamiento-details">
                      <p><strong>Descripción:</strong> {tratamiento.descripcion}</p>
                      <p><strong>Duración:</strong> {tratamiento.duracion}</p>
                      <p><strong>Fecha de inicio:</strong> {formatDate(tratamiento.fechaInicio)}</p>
                      <p><strong>Fecha de fin:</strong> {formatDate(tratamiento.fechaFin)}</p>
                      {tratamiento.seguimiento && (
                        <p><strong>Seguimiento:</strong> {tratamiento.seguimiento}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-tratamiento">
                <p>No hay tratamientos activos para este paciente.</p>
              </div>
            )}
          </div>

          {/* Lista de tratamientos anteriores */}
          {tratamientos.length > 1 && (
            <div className="tratamientos-anteriores-section">
              <h3>Tratamientos Anteriores</h3>
              <div className="tratamientos-lista">
                {tratamientos
                  .filter(t => t.id !== tratamientoActual?.id)
                  .map(tratamiento => (
                    <div 
                      key={tratamiento.id} 
                      className="tratamiento-item"
                      onClick={() => handleVerDetallesTratamiento(tratamiento)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="tratamiento-item-header">
                        <h4>{tratamiento.nombre}</h4>
                        <span className={`estado ${tratamiento.activo ? 'activo' : 'inactivo'}`}>
                          {tratamiento.activo ? 'Activo' : 'Completado'}
                        </span>
                      </div>
                      <p><strong>Descripción:</strong> {tratamiento.descripcion}</p>
                      <p><strong>Duración:</strong> {tratamiento.duracion}</p>
                      <p><strong>Período:</strong> {formatDate(tratamiento.fechaInicio)} - {formatDate(tratamiento.fechaFin)}</p>
                      <div className="tratamiento-item-hint">
                        <small>💡 Haz clic para ver detalles completos</small>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Modal para nuevo tratamiento */}
          {showNuevoTratamiento && (
            <div className="nuevo-tratamiento-modal">
              <div className="nuevo-tratamiento-content">
                <div className="nuevo-tratamiento-header">
                  <h3>Crear Nuevo Tratamiento</h3>
                  <button className="btn-cerrar" onClick={handleCancelar}>
                    ×
                  </button>
                </div>

                <div className="form-section">
                  <div className="form-group">
                    <label>Nombre del Tratamiento *</label>
                    <input
                      type="text"
                      value={nuevoTratamiento.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      placeholder="Ej: Ortodoncia, Endodoncia, etc."
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Descripción *</label>
                    <textarea
                      value={nuevoTratamiento.descripcion}
                      onChange={(e) => handleInputChange('descripcion', e.target.value)}
                      placeholder="Describa el tratamiento a realizar"
                      rows="4"
                      className="form-textarea"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Duración</label>
                      <input
                        type="text"
                        value={nuevoTratamiento.duracion}
                        onChange={(e) => handleInputChange('duracion', e.target.value)}
                        placeholder="Ej: 6 meses, 1 año, etc."
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Seguimiento</label>
                      <input
                        type="text"
                        value={nuevoTratamiento.seguimiento}
                        onChange={(e) => handleInputChange('seguimiento', e.target.value)}
                        placeholder="Ej: Mensual, Semanal, etc."
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Fecha de Inicio</label>
                      <input
                        type="date"
                        value={nuevoTratamiento.fechaInicio}
                        onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Fecha de Fin</label>
                      <input
                        type="date"
                        value={nuevoTratamiento.fechaFin}
                        onChange={(e) => handleInputChange('fechaFin', e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button 
                      className="btn-guardar"
                      onClick={handleGuardarTratamiento}
                      disabled={loading}
                    >
                      {loading ? 'Guardando...' : 'Guardar Tratamiento'}
                    </button>
                    <button 
                      className="btn-cancelar"
                      onClick={handleCancelar}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal para editar tratamiento */}
          {showEditarTratamiento && (
            <div className="nuevo-tratamiento-modal">
              <div className="nuevo-tratamiento-content">
                <div className="nuevo-tratamiento-header">
                  <h3>Editar Tratamiento</h3>
                  <button className="btn-cerrar" onClick={handleCancelar}>
                    ×
                  </button>
                </div>

                <div className="form-section">
                  <div className="form-group">
                    <label>Nombre del Tratamiento *</label>
                    <input
                      type="text"
                      value={nuevoTratamiento.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      placeholder="Ej: Ortodoncia, Endodoncia, etc."
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Descripción *</label>
                    <textarea
                      value={nuevoTratamiento.descripcion}
                      onChange={(e) => handleInputChange('descripcion', e.target.value)}
                      placeholder="Describa el tratamiento a realizar"
                      rows="4"
                      className="form-textarea"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Duración</label>
                      <input
                        type="text"
                        value={nuevoTratamiento.duracion}
                        onChange={(e) => handleInputChange('duracion', e.target.value)}
                        placeholder="Ej: 6 meses, 1 año, etc."
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Seguimiento</label>
                      <input
                        type="text"
                        value={nuevoTratamiento.seguimiento}
                        onChange={(e) => handleInputChange('seguimiento', e.target.value)}
                        placeholder="Ej: Mensual, Semanal, etc."
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Fecha de Inicio</label>
                      <input
                        type="date"
                        value={nuevoTratamiento.fechaInicio}
                        onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Fecha de Fin</label>
                      <input
                        type="date"
                        value={nuevoTratamiento.fechaFin}
                        onChange={(e) => handleInputChange('fechaFin', e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button 
                      className="btn-guardar"
                      onClick={handleActualizarTratamiento}
                      disabled={loading}
                    >
                      {loading ? 'Actualizando...' : 'Actualizar Tratamiento'}
                    </button>
                    <button 
                      className="btn-cancelar"
                      onClick={handleCancelar}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal para ver detalles del tratamiento */}
          {showDetallesTratamiento && tratamientoSeleccionado && (
            <div className="nuevo-tratamiento-modal">
              <div className="nuevo-tratamiento-content">
                <div className="nuevo-tratamiento-header">
                  <h3>Detalles del Tratamiento</h3>
                  <button className="btn-cerrar" onClick={handleCancelar}>
                    ×
                  </button>
                </div>

                <div className="form-section">
                  <div className="detalles-tratamiento-content">
                    <div className="detalle-item">
                      <h4>📋 Información General</h4>
                      <div className="detalle-info">
                        <p><strong>Nombre del Tratamiento:</strong> {tratamientoSeleccionado.nombre}</p>
                        <p><strong>Estado:</strong> 
                          <span className={`estado ${tratamientoSeleccionado.activo ? 'activo' : 'inactivo'}`}>
                            {tratamientoSeleccionado.activo ? 'Activo' : 'Completado'}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="detalle-item">
                      <h4>📝 Descripción</h4>
                      <div className="detalle-info">
                        <p>{tratamientoSeleccionado.descripcion}</p>
                      </div>
                    </div>

                    <div className="detalle-item">
                      <h4>⏱️ Duración y Seguimiento</h4>
                      <div className="detalle-info">
                        <p><strong>Duración:</strong> {tratamientoSeleccionado.duracion || 'No especificada'}</p>
                        <p><strong>Seguimiento:</strong> {tratamientoSeleccionado.seguimiento || 'No especificado'}</p>
                      </div>
                    </div>

                    <div className="detalle-item">
                      <h4>📅 Fechas del Tratamiento</h4>
                      <div className="detalle-info">
                        <p><strong>Fecha de Inicio:</strong> {formatDate(tratamientoSeleccionado.fechaInicio) || 'No especificada'}</p>
                        <p><strong>Fecha de Fin:</strong> {formatDate(tratamientoSeleccionado.fechaFin) || 'No especificada'}</p>
                      </div>
                    </div>

                    {tratamientoSeleccionado.createdAt && (
                      <div className="detalle-item">
                        <h4>📊 Información del Sistema</h4>
                        <div className="detalle-info">
                          <p><strong>Fecha de Creación:</strong> {formatDate(tratamientoSeleccionado.createdAt)}</p>
                          {tratamientoSeleccionado.updatedAt && (
                            <p><strong>Última Actualización:</strong> {formatDate(tratamientoSeleccionado.updatedAt)}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-actions">
                    <button 
                      className="btn-cancelar"
                      onClick={handleCancelar}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanTratamiento; 