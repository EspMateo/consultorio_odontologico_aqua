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
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [presupuestoActual, setPresupuestoActual] = useState(null);
  const [isModifying, setIsModifying] = useState(false);

  // Estados para tratamientos
  const [tratamientos, setTratamientos] = useState([
    {
      id: Date.now(),
      nombre: '',
      precio: 0,
      abonado: 0,
      pagado: false
    }
  ]);
  const [showCustomTreatment, setShowCustomTreatment] = useState(false);
  const [customTreatment, setCustomTreatment] = useState('');

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

  // Cargar fechas disponibles cuando se selecciona un paciente
  useEffect(() => {
    if (selectedPaciente) {
      cargarFechasDisponibles();
    } else {
      setFechasDisponibles([]);
      setFechaSeleccionada('');
    }
  }, [selectedPaciente]);

  // Cargar datos cuando se selecciona una fecha
  useEffect(() => {
    if (selectedPaciente && fechaSeleccionada) {
      cargarDatosPresupuesto();
    }
  }, [fechaSeleccionada]);

  const cargarFechasDisponibles = async () => {
    try {
      // Por ahora simulamos fechas disponibles
      // En el futuro esto vendría del backend
      const fechas = ['2024-01-15', '2024-02-20', '2024-03-10'];
      setFechasDisponibles(fechas);
    } catch (error) {
      console.error('Error al cargar fechas:', error);
      setFechasDisponibles([]);
    }
  };

  const cargarDatosPresupuesto = async () => {
    try {
      setLoading(true);
      // Por ahora simulamos datos
      // En el futuro esto vendría del backend
      const data = {
        id: 1,
        tratamientos: [
          { id: 1, nombre: 'Resina', precio: 50000, abonado: 30000, pagado: false },
          { id: 2, nombre: 'Endodoncia', precio: 120000, abonado: 80000, pagado: false }
        ]
      };
      
      setTratamientos(data.tratamientos);
      setPresupuestoActual(data);
      setIsModifying(true);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setMessage('Error al cargar datos de la fecha seleccionada');
      limpiarDatos();
    } finally {
      setLoading(false);
    }
  };

  const limpiarDatos = () => {
    setTratamientos([
      {
        id: Date.now(),
        nombre: '',
        precio: 0,
        abonado: 0,
        pagado: false
      }
    ]);
    setPresupuestoActual(null);
    setIsModifying(false);
    setShowCustomTreatment(false);
    setCustomTreatment('');
  };

  const handlePacienteChange = (pacienteId) => {
    setSelectedPaciente(pacienteId);
    setFechaSeleccionada('');
    limpiarDatos();
  };

  const handleFechaChange = (fecha) => {
    setFechaSeleccionada(fecha);
    if (fecha === '') {
      limpiarDatos();
    }
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
  };

  const handleEliminarTratamiento = (id) => {
    setTratamientos(tratamientos.filter(t => t.id !== id));
  };

  const handleTratamientoChange = (id, campo, valor) => {
    setTratamientos(tratamientos.map(t => 
      t.id === id ? { ...t, [campo]: valor } : t
    ));
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

      // Aquí iría la llamada al backend
      console.log('Guardando presupuesto:', presupuestoData);
      setMessage('Presupuesto guardado exitosamente');
      setTimeout(() => setMessage(null), 3000);
      
      // Recargar fechas disponibles
      await cargarFechasDisponibles();
      
    } catch (error) {
      console.error('Error al guardar:', error);
      setMessage('Error al guardar: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleModificar = async () => {
    if (!presupuestoActual) {
      setMessage('No hay datos para modificar');
      return;
    }

    setLoading(true);
    try {
      const presupuestoData = {
        pacienteId: parseInt(selectedPaciente),
        fechaRegistro: fechaPresupuesto,
        tratamientos: tratamientos
      };

      // Aquí iría la llamada al backend
      console.log('Modificando presupuesto:', presupuestoData);
      setMessage('Presupuesto modificado exitosamente');
      setTimeout(() => setMessage(null), 3000);
      
    } catch (error) {
      console.error('Error al modificar:', error);
      setMessage('Error al modificar: ' + (error.response?.data?.error || error.message));
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

            <div className="form-group">
              <label>Fechas Disponibles:</label>
              <select 
                value={fechaSeleccionada} 
                onChange={(e) => handleFechaChange(e.target.value)}
                className="form-select"
              >
                <option value="">Seleccionar fecha</option>
                {fechasDisponibles.map(fecha => (
                  <option key={fecha} value={fecha}>
                    {new Date(fecha).toLocaleDateString()}
                  </option>
                ))}
              </select>
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
                      <button 
                        className="btn-eliminar-tratamiento"
                        onClick={() => handleEliminarTratamiento(tratamiento.id)}
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="tratamiento-fields">
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

                      <div className="form-group">
                        <label>Abonado ($):</label>
                        <input
                          type="number"
                          value={tratamiento.abonado}
                          onChange={(e) => handleTratamientoChange(tratamiento.id, 'abonado', parseInt(e.target.value) || 0)}
                          className="form-input"
                          min="0"
                        />
                      </div>

                      <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={tratamiento.pagado}
                            onChange={(e) => handleTratamientoChange(tratamiento.id, 'pagado', e.target.checked)}
                            className="checkbox-input"
                          />
                          <span className="checkbox-custom"></span>
                          Pagado completamente
                        </label>
                      </div>

                      <div className="tratamiento-deuda">
                        <span className="deuda-label">Deuda: </span>
                        <span className={`deuda-valor ${tratamiento.precio - tratamiento.abonado > 0 ? 'deuda-pendiente' : 'deuda-pagada'}`}>
                          ${(tratamiento.precio - tratamiento.abonado).toLocaleString()}
                        </span>
                      </div>
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
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              
              {isModifying && (
                <button 
                  className="btn-modificar" 
                  onClick={handleModificar}
                  disabled={loading}
                >
                  {loading ? 'Modificando...' : 'Modificar'}
                </button>
              )}
              
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