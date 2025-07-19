import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { buildApiUrl } from '../../config';
import './Periodoncia.css';

const Periodoncia = () => {
  const navigate = useNavigate();
  
  // Estados principales
  const [selectedPaciente, setSelectedPaciente] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [fechaRegistro, setFechaRegistro] = useState('');
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [tipoFicha, setTipoFicha] = useState('');
  const [dientesSeleccionados, setDientesSeleccionados] = useState({});
  const [indiceSarro, setIndiceSarro] = useState({});
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [periodonciaActual, setPeriodonciaActual] = useState(null);
  const [isModifying, setIsModifying] = useState(false);

  // Números de dientes permanentes
  const dientesSuperiores = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const dientesInferiores = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
  const todosLosDientes = [...dientesSuperiores, ...dientesInferiores];

  // Establecer fecha actual por defecto
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFechaRegistro(today);
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
      cargarDatosPeriodoncia();
    }
  }, [fechaSeleccionada]);

  const cargarFechasDisponibles = async () => {
    try {
      const response = await axios.get(buildApiUrl(`periodoncia/paciente/${selectedPaciente}/fechas`));
      setFechasDisponibles(response.data);
    } catch (error) {
      console.error('Error al cargar fechas:', error);
      setFechasDisponibles([]);
    }
  };

  const cargarDatosPeriodoncia = async () => {
    try {
      setLoading(true);
      const response = await axios.get(buildApiUrl(`periodoncia/paciente/${selectedPaciente}/fecha/${fechaSeleccionada}`));
      const data = response.data;
      
      setTipoFicha(data.tipoFicha);
      setDientesSeleccionados(data.indicePlaca || {});
      setIndiceSarro(data.indiceSarro || {});
      setObservaciones(data.observaciones || '');
      setPeriodonciaActual(data);
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
    setTipoFicha('');
    setDientesSeleccionados({});
    setIndiceSarro({});
    setObservaciones('');
    setPeriodonciaActual(null);
    setIsModifying(false);
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

  const handleTipoFichaChange = (tipo) => {
    setTipoFicha(tipo);
  };

  const handleDienteClick = (numeroDiente, sector) => {
    const key = `${numeroDiente}-${sector}`;
    setDientesSeleccionados(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getDienteClass = (numeroDiente, sector) => {
    const key = `${numeroDiente}-${sector}`;
    return dientesSeleccionados[key] ? 'selected' : '';
  };

  const handleSarroClick = (numeroDiente, sector) => {
    setIndiceSarro(prev => ({
      ...prev,
      [numeroDiente]: {
        ...prev[numeroDiente],
        [sector]: !prev[numeroDiente]?.[sector]
      }
    }));
  };

  const getSarroClass = (numeroDiente, sector) => {
    return indiceSarro[numeroDiente]?.[sector] ? 'selected' : '';
  };

  const calcularPorcentajePlaca = () => {
    const totalSectores = Object.keys(dientesSeleccionados).length;
    const sectoresSeleccionados = Object.values(dientesSeleccionados).filter(Boolean).length;
    return totalSectores > 0 ? Math.round((sectoresSeleccionados / totalSectores) * 100) : 0;
  };

  const calcularPorcentajeSarro = () => {
    let sectoresConSarro = 0;
    let totalSectores = 0;
    
    todosLosDientes.forEach(numero => {
      const dienteSarro = indiceSarro[numero];
      if (dienteSarro) {
        Object.values(dienteSarro).forEach(tieneSarro => {
          totalSectores++;
          if (tieneSarro) sectoresConSarro++;
        });
      } else {
        totalSectores += 2; // 2 sectores por diente (superior e inferior)
      }
    });
    
    return totalSectores > 0 ? Math.round((sectoresConSarro / totalSectores) * 100) : 0;
  };

  const handleGuardar = async () => {
    if (!selectedPaciente || !tipoFicha) {
      setMessage('Por favor complete todos los campos requeridos');
      return;
    }

    setLoading(true);
    try {
      const periodonciaData = {
        pacienteId: parseInt(selectedPaciente),
        fechaRegistro: fechaRegistro,
        tipoFicha: tipoFicha,
        indicePlaca: dientesSeleccionados,
        indiceSarro: indiceSarro,
        observaciones: observaciones
      };



      const response = await axios.post(buildApiUrl('periodoncia'), periodonciaData);
      
      console.log('Respuesta exitosa:', response.data);
      setMessage(response.data.message);
      setTimeout(() => setMessage(null), 3000);
      
      // Recargar fechas disponibles
      await cargarFechasDisponibles();
      
    } catch (error) {
      console.error('Error al guardar:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error message:', error.message);
      setMessage('Error al guardar: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleModificar = async () => {
    if (!periodonciaActual) {
      setMessage('No hay datos para modificar');
      return;
    }

    setLoading(true);
    try {
      const periodonciaData = {
        pacienteId: parseInt(selectedPaciente),
        fechaRegistro: fechaRegistro,
        tipoFicha: tipoFicha,
        indicePlaca: dientesSeleccionados,
        indiceSarro: indiceSarro,
        observaciones: observaciones
      };

      const response = await axios.put(buildApiUrl(`periodoncia/${periodonciaActual.id}`), periodonciaData);
      
      setMessage(response.data.message);
      setTimeout(() => setMessage(null), 3000);
      
    } catch (error) {
      console.error('Error al modificar:', error);
      setMessage('Error al modificar: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate('/');
  };

  const renderDienteCubo = (numero) => (
    <div key={numero} className="diente-cubo">
      <div className="diente-cubo-grid">
        <button 
          className={`cubo-cara cubo-superior-izquierdo ${getDienteClass(numero, 'superior-izquierdo')}`}
          onClick={() => handleDienteClick(numero, 'superior-izquierdo')}
        ></button>
        <button 
          className={`cubo-cara cubo-superior-derecho ${getDienteClass(numero, 'superior-derecho')}`}
          onClick={() => handleDienteClick(numero, 'superior-derecho')}
        ></button>
        <button 
          className={`cubo-cara cubo-inferior-izquierdo ${getDienteClass(numero, 'inferior-izquierdo')}`}
          onClick={() => handleDienteClick(numero, 'inferior-izquierdo')}
        ></button>
        <button 
          className={`cubo-cara cubo-inferior-derecho ${getDienteClass(numero, 'inferior-derecho')}`}
          onClick={() => handleDienteClick(numero, 'inferior-derecho')}
        ></button>
      </div>
      <div className="diente-numero-placa">{numero}</div>
    </div>
  );

  const renderDienteSarro = (numero) => (
    <div key={numero} className="diente-sarro-cubo">
      <div className="diente-sarro-grid">
        <button 
          className={`sarro-cara sarro-superior ${getSarroClass(numero, 'superior')}`}
          onClick={() => handleSarroClick(numero, 'superior')}
        ></button>
        <button 
          className={`sarro-cara sarro-inferior ${getSarroClass(numero, 'inferior')}`}
          onClick={() => handleSarroClick(numero, 'inferior')}
        ></button>
      </div>
      <div className="diente-numero">{numero}</div>
    </div>
  );

  return (
    <div className="periodoncia-container">
      <div className="periodoncia-header">
        <h1>Periodoncia</h1>
      </div>
      
      <div className="periodoncia-content">
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
              <label>Fecha de Registro:</label>
              <input
                type="date"
                value={fechaRegistro}
                onChange={(e) => setFechaRegistro(e.target.value)}
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

          {/* Tipo de Ficha - Compacto */}
          <div className="tipo-ficha-section">
            <h3>Tipo de Ficha:</h3>
            <div className="tipo-ficha-options">
              <label className="tipo-ficha-option">
                <input
                  type="radio"
                  name="tipoFicha"
                  value="INICIAL"
                  checked={tipoFicha === 'INICIAL'}
                  onChange={() => handleTipoFichaChange('INICIAL')}
                  className="radio-input"
                />
                <span className="radio-custom"></span>
                <span className="option-text">INICIAL</span>
              </label>

              <label className="tipo-ficha-option">
                <input
                  type="radio"
                  name="tipoFicha"
                  value="REEVALUACION"
                  checked={tipoFicha === 'REEVALUACION'}
                  onChange={() => handleTipoFichaChange('REEVALUACION')}
                  className="radio-input"
                />
                <span className="radio-custom"></span>
                <span className="option-text">REEVALUACIÓN</span>
              </label>

              <label className="tipo-ficha-option">
                <input
                  type="radio"
                  name="tipoFicha"
                  value="CONTROL_PERIODICO"
                  checked={tipoFicha === 'CONTROL_PERIODICO'}
                  onChange={() => handleTipoFichaChange('CONTROL_PERIODICO')}
                  className="radio-input"
                />
                <span className="radio-custom"></span>
                <span className="option-text">CONTROL PERIÓDICO</span>
              </label>
            </div>
          </div>

          {/* Índice de Placa */}
          <div className="indice-placa-section">
            <h3>Índice de Placa</h3>
            <div className="odontograma-permanente">
              <div className="fila-dientes-superior">
                {dientesSuperiores.map(numero => renderDienteCubo(numero))}
              </div>
              <div className="fila-dientes-inferior">
                {dientesInferiores.map(numero => renderDienteCubo(numero))}
              </div>
            </div>
            
            <div className="indice-placa-info">
              <div className="porcentaje-item">
                <span className="porcentaje-label">Índice de placa:</span>
                <span className="porcentaje-valor">{calcularPorcentajePlaca()}%</span>
              </div>
            </div>
          </div>

          {/* Índice de Sarro */}
          <div className="indice-sarro-section">
            <h3>Índice de Sarro</h3>
            <div className="odontograma-sarro">
              <div className="fila-dientes-superior">
                {dientesSuperiores.map(numero => renderDienteSarro(numero))}
              </div>
              <div className="fila-dientes-inferior">
                {dientesInferiores.map(numero => renderDienteSarro(numero))}
              </div>
            </div>
            
            <div className="indice-sarro-info">
              <div className="porcentaje-item">
                <span className="porcentaje-label">Índice de sarro:</span>
                <span className="porcentaje-valor">{calcularPorcentajeSarro()}%</span>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div className="observaciones-section">
            <h3>Observaciones</h3>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Agregar observaciones..."
              rows="3"
              className="observaciones-textarea"
            />
          </div>

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
                disabled={loading || !selectedPaciente || !tipoFicha}
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

export default Periodoncia; 