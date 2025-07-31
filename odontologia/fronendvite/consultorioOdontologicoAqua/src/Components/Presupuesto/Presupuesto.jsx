import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { buildApiUrl } from '../../config';
import './Presupuesto.css';

const Presupuesto = () => {
  const navigate = useNavigate();
  const { pacienteId } = useParams();
  const location = useLocation();
  const pacienteFromState = location.state?.paciente;
  
  // Estados principales
  const [selectedPaciente, setSelectedPaciente] = useState(pacienteId || pacienteFromState?.id || '');
  const [pacientes, setPacientes] = useState([]);
  const [fechaPresupuesto, setFechaPresupuesto] = useState('');
  const [presupuestos, setPresupuestos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [presupuestoActual, setPresupuestoActual] = useState(null);

  // Estados para tratamientos
  const [tratamientos, setTratamientos] = useState([]);
  const [showCustomTreatment, setShowCustomTreatment] = useState(false);
  const [customTreatment, setCustomTreatment] = useState('');
  const [expandedTratamientos, setExpandedTratamientos] = useState(new Set());


  // Opciones predefinidas de tratamientos
  const tratamientosPredefinidos = [
    { nombre: 'Resina', precio: 50000 },
    { nombre: 'Endodoncia', precio: 120000 },
    { nombre: 'Perno', precio: 80000 },
    { nombre: 'Incrustación', precio: 150000 },
    { nombre: 'Carilla', precio: 200000 },
    { nombre: 'Corona', precio: 250000 }
  ];

  // Establecer fecha actual por defecto
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFechaPresupuesto(today);
    cargarPacientes();
  }, []);

  // Cargar pacientes
  const cargarPacientes = async () => {
    try {
      const response = await axios.get(buildApiUrl('pacientes'));
      setPacientes(response.data);
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
      setMessage('Error al cargar pacientes');
    }
  };

  // Cargar presupuestos cuando se selecciona un paciente
  useEffect(() => {
    if (selectedPaciente) {
      cargarPresupuestos();
    } else {
      setPresupuestos([]);
    }
  }, [selectedPaciente]);

  const cargarPresupuestos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(buildApiUrl(`presupuesto/paciente/${selectedPaciente}`));
      setPresupuestos(response.data);
      
      // Si hay presupuestos, cargar automáticamente el primero
      if (response.data && response.data.length > 0) {
        const primerPresupuesto = response.data[0];
        setPresupuestoActual(primerPresupuesto);
        setTratamientos(primerPresupuesto.tratamientos || []);
        setFechaPresupuesto(primerPresupuesto.fechaRegistro);
        
        // Expandir automáticamente todos los tratamientos
        if (primerPresupuesto.tratamientos && primerPresupuesto.tratamientos.length > 0) {
          const expandedIds = new Set(primerPresupuesto.tratamientos.map(t => t.id));
          setExpandedTratamientos(expandedIds);
        }
      }
    } catch (error) {
      console.error('Error al cargar presupuestos:', error);
      setPresupuestos([]);
    } finally {
      setLoading(false);
    }
  };

  const limpiarDatos = () => {
    setTratamientos([]);
    setPresupuestoActual(null);
    setShowCustomTreatment(false);
    setCustomTreatment('');
    setExpandedTratamientos(new Set());
  };

  const handlePacienteChange = (pacienteId) => {
    setSelectedPaciente(pacienteId);
    limpiarDatos();
  };

  const handlePresupuestoSelect = (presupuesto) => {
    setPresupuestoActual(presupuesto);
    setTratamientos(presupuesto.tratamientos || []);
    setFechaPresupuesto(presupuesto.fechaRegistro);
  };

  const handleAgregarTratamiento = () => {
    const nuevoTratamiento = {
      id: Date.now(),
      nombre: '',
      precio: 0,
      abonado: 0,
      pagado: false
    };
    setTratamientos([...tratamientos, nuevoTratamiento]);
    
    // Expandir automáticamente el nuevo tratamiento
    const newExpanded = new Set(expandedTratamientos);
    newExpanded.add(nuevoTratamiento.id);
    setExpandedTratamientos(newExpanded);
  };

  const handleEliminarTratamiento = (id) => {
    setTratamientos(tratamientos.filter(t => t.id !== id));
  };

  const handleTratamientoChange = (id, campo, valor) => {
    setTratamientos(tratamientos.map(t => 
      t.id === id ? { ...t, [campo]: valor } : t
    ));
    
    // Si es un campo de pago y hay un presupuesto actual, actualizar el pago
    if (campo === 'abonado' && presupuestoActual) {
      handlePagoChange(id, valor);
    }
  };

  const handlePagoChange = async (tratamientoId, nuevoAbonado) => {
    if (!presupuestoActual) return;
    
    // Verificar si el tratamiento ya existe en la base de datos (tiene un ID real)
    const tratamiento = presupuestoActual.tratamientos?.find(t => t.id === tratamientoId);
    
    if (tratamiento && tratamiento.id > 1000) { // Los IDs de la BD son mayores a 1000
      // Es un tratamiento existente, actualizar en la BD
      try {
        setLoading(true);
        const response = await axios.put(
          buildApiUrl(`presupuesto/${presupuestoActual.id}/tratamiento/${tratamientoId}/pago`),
          { abonado: nuevoAbonado }
        );
        
        // Actualizar el presupuesto actual con los nuevos datos
        setPresupuestoActual(response.data.presupuesto);
        setTratamientos(response.data.presupuesto.tratamientos);
        
        setMessage('Pago actualizado exitosamente');
        setTimeout(() => setMessage(null), 3000);
        
      } catch (error) {
        console.error('Error al actualizar pago:', error);
        setMessage('Error al actualizar pago: ' + (error.response?.data?.error || error.message));
      } finally {
        setLoading(false);
      }
    } else {
      // Es un tratamiento nuevo, solo actualizar localmente
      setTratamientos(tratamientos.map(t => 
        t.id === tratamientoId ? { ...t, abonado: nuevoAbonado } : t
      ));
    }
  };

  const handleSelectTratamiento = (id, tratamientoSeleccionado) => {
    const tratamiento = tratamientosPredefinidos.find(t => t.nombre === tratamientoSeleccionado);
    if (tratamiento) {
      setTratamientos(tratamientos.map(t => 
        t.id === id ? { ...t, nombre: tratamiento.nombre, precio: tratamiento.precio } : t
      ));
    }
  };

  const handleCustomTreatmentChange = (id, valor) => {
    setTratamientos(tratamientos.map(t => 
      t.id === id ? { ...t, nombre: valor } : t
    ));
  };

  const toggleTratamientoExpansion = (tratamientoId) => {
    const newExpanded = new Set(expandedTratamientos);
    if (newExpanded.has(tratamientoId)) {
      newExpanded.delete(tratamientoId);
    } else {
      newExpanded.add(tratamientoId);
    }
    setExpandedTratamientos(newExpanded);
  };



  const calcularTotalPresupuesto = () => {
    return tratamientos.reduce((total, t) => total + t.precio, 0);
  };

  const calcularTotalAbonado = () => {
    return tratamientos.reduce((total, t) => total + t.abonado, 0);
  };

  const calcularDeuda = () => {
    return calcularTotalPresupuesto() - calcularTotalAbonado();
  };

  const handleGuardar = async () => {
    if (!selectedPaciente || tratamientos.length === 0) {
      setMessage('Por favor complete todos los campos requeridos');
      return;
    }

    // Validar que al menos un tratamiento tenga nombre
    const tratamientosValidos = tratamientos.filter(t => t.nombre && t.nombre.trim() !== '');
    if (tratamientosValidos.length === 0) {
      setMessage('Por favor agregue al menos un tratamiento');
      return;
    }

    setLoading(true);
    try {
      const presupuestoData = {
        pacienteId: parseInt(selectedPaciente),
        fechaRegistro: fechaPresupuesto,
        tratamientos: tratamientosValidos
      };

      let response;
      
      // Si hay un presupuesto actual (modo modificación)
      if (presupuestoActual) {
        response = await axios.put(buildApiUrl(`presupuesto/${presupuestoActual.id}`), presupuestoData);
        setMessage('Presupuesto actualizado exitosamente');
      } else {
        // Si no hay presupuesto actual (modo creación)
        response = await axios.post(buildApiUrl('presupuesto'), presupuestoData);
        setMessage('Presupuesto creado exitosamente');
      }
      
      console.log('Respuesta exitosa:', response.data);
      setTimeout(() => setMessage(null), 3000);
      
      // Recargar presupuestos
      await cargarPresupuestos();
      
    } catch (error) {
      console.error('Error al guardar:', error);
      setMessage('Error al guardar: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };



  const handleVolver = () => {
    navigate('/dashboard');
  };

  return (
    <div className="presupuesto-container">
      <div className="presupuesto-header">
        <h1>Presupuesto</h1>
      </div>
      
      <div className="presupuesto-content">
        <div className="form-section">
          {/* Selección de paciente y fecha */}
          <div className="form-row">
            <div className="form-group">
              <label>Paciente:</label>
              <select 
                value={selectedPaciente} 
                onChange={(e) => handlePacienteChange(e.target.value)}
                className="form-select"
              >
                <option value="">Seleccionar paciente</option>
                {pacientes.map(paciente => (
                  <option key={paciente.id} value={paciente.id}>
                    {paciente.name} {paciente.lastname}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Fecha de Presupuesto:</label>
              <input
                type="date"
                value={fechaPresupuesto}
                onChange={(e) => setFechaPresupuesto(e.target.value)}
                className="form-input"
              />
            </div>


          </div>


          {/* Gestión de Tratamientos */}
          <div className="tratamientos-section">
            <div className="tratamientos-header">
              <h3>Tratamientos</h3>
              <button 
                className="btn-agregar-tratamiento"
                onClick={handleAgregarTratamiento}
              >
                + Agregar Otro Tratamiento
              </button>
            </div>

            {tratamientos.length === 0 ? (
              <div className="no-tratamientos">
                <p>No hay tratamientos agregados.</p>
              </div>
            ) : (
              <div className="tratamientos-list">
                {tratamientos.map((tratamiento, index) => (
                  <div key={tratamiento.id} className="tratamiento-item">
                    <div className="tratamiento-header">
                      <h4>Tratamiento {index + 1}</h4>
                      <div className="tratamiento-buttons">
                        <button 
                          className="btn-expandir-tratamiento"
                          onClick={() => toggleTratamientoExpansion(tratamiento.id)}
                          title={expandedTratamientos.has(tratamiento.id) ? "Minimizar" : "Expandir"}
                        >
                          {expandedTratamientos.has(tratamiento.id) ? '−' : '+'}
                        </button>
                        <button 
                          className="btn-eliminar-tratamiento"
                          onClick={() => handleEliminarTratamiento(tratamiento.id)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    
                    <div className={`tratamiento-fields ${expandedTratamientos.has(tratamiento.id) ? 'expanded' : 'collapsed'}`}>
                      {/* Fila 1: Tipo de tratamiento y Precio */}
                      <div className="form-row">
                        <div className="form-group">
                          <label>Tipo de Tratamiento:</label>
                          <select 
                            value={tratamiento.nombre}
                            onChange={(e) => handleSelectTratamiento(tratamiento.id, e.target.value)}
                            className="form-select"
                          >
                            <option value="">Seleccionar tratamiento</option>
                            {tratamientosPredefinidos.map(t => (
                              <option key={t.nombre} value={t.nombre}>
                                {t.nombre} - ${t.precio.toLocaleString()}
                              </option>
                            ))}
                            <option value="custom">Otro (escribir)</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Precio ($):</label>
                          <input
                            type="number"
                            value={tratamiento.precio}
                            onChange={(e) => handleTratamientoChange(tratamiento.id, 'precio', parseInt(e.target.value) || 0)}
                            className="form-input"
                            min="0"
                          />
                        </div>
                      </div>

                      {/* Tratamiento personalizado si es necesario */}
                      {tratamiento.nombre === 'custom' && (
                        <div className="form-group">
                          <label>Tratamiento Personalizado:</label>
                          <input
                            type="text"
                            value={customTreatment}
                            onChange={(e) => handleCustomTreatmentChange(tratamiento.id, e.target.value)}
                            placeholder="Escriba el tratamiento realizado"
                            className="form-input"
                          />
                        </div>
                      )}

                      {/* Fila 2: Abonado y Estado de pago */}
                      <div className="form-row">
                        <div className="form-group">
                          <label>Abonado ($):</label>
                          <input
                            type="number"
                            value={tratamiento.abonado}
                            onChange={(e) => {
                              const nuevoAbonado = parseInt(e.target.value) || 0;
                              handleTratamientoChange(tratamiento.id, 'abonado', nuevoAbonado);
                            }}
                            className="form-input"
                            min="0"
                          />
                        </div>

                        <div className="form-group pagado-group">
                          <label>Estado de Pago:</label>
                          <div className="pagado-buttons">
                            <button
                              type="button"
                              className={`btn-pagado ${tratamiento.pagado ? 'pagado' : 'no-pagado'}`}
                              onClick={() => handleTratamientoChange(tratamiento.id, 'pagado', !tratamiento.pagado)}
                            >
                              {tratamiento.pagado ? '✓ Pagado' : '○ Pendiente'}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="tratamiento-deuda">
                        <span className="deuda-label">Deuda: </span>
                        <span className={`deuda-valor ${tratamiento.precio - tratamiento.abonado > 0 ? 'deuda-pendiente' : 'deuda-pagada'}`}>
                          ${(tratamiento.precio - tratamiento.abonado).toLocaleString()}
                        </span>
                      </div>

                      {/* Información de fechas - solo mostrar si hay datos reales */}
                      {tratamiento.fechaCreacion && (
                        <div className="tratamiento-fechas">
                          <div className="fecha-info">
                            <span className="fecha-label">Creado: </span>
                            <span className="fecha-valor">
                              {new Date(tratamiento.fechaCreacion).toLocaleString()}
                            </span>
                          </div>
                          {tratamiento.fechaUltimaActualizacion && 
                           tratamiento.fechaUltimaActualizacion !== tratamiento.fechaCreacion && (
                            <div className="fecha-info">
                              <span className="fecha-label">Última actualización: </span>
                              <span className="fecha-valor">
                                {new Date(tratamiento.fechaUltimaActualizacion).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resumen de Totales */}
          {tratamientos.length > 0 && (
            <div className="resumen-section">
              <h3>Resumen</h3>
              <div className="resumen-grid">
                <div className="resumen-item">
                  <span className="resumen-label">Total Presupuesto:</span>
                  <span className="resumen-valor">${calcularTotalPresupuesto().toLocaleString()}</span>
                </div>
                <div className="resumen-item">
                  <span className="resumen-label">Total Abonado:</span>
                  <span className="resumen-valor">${calcularTotalAbonado().toLocaleString()}</span>
                </div>
                <div className="resumen-item">
                  <span className="resumen-label">Deuda Total:</span>
                  <span className={`resumen-valor ${calcularDeuda() > 0 ? 'deuda-pendiente' : 'deuda-pagada'}`}>
                    ${calcularDeuda().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Mensajes y Botones */}
          <div className="acciones-section">
            {message && (
              <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}
            
            <div className="botones-container">
              <button 
                className="btn-guardar" 
                onClick={handleGuardar}
                disabled={loading || !selectedPaciente}
              >
                {loading ? 'Guardando...' : (presupuestoActual ? 'Actualizar' : 'Guardar')}
              </button>
              
              <button 
                className="btn-volver" 
                onClick={handleVolver}
                disabled={loading}
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presupuesto; 