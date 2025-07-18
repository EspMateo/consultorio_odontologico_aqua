import React, { useState, useEffect } from 'react';
import './Periodoncia.css';

const Periodoncia = () => {
  const [selectedPaciente, setSelectedPaciente] = useState('');
  const [fechaRegistro, setFechaRegistro] = useState('');
  const [tipoFicha, setTipoFicha] = useState('');
  const [dientesSeleccionados, setDientesSeleccionados] = useState({});
  const [indiceSarro, setIndiceSarro] = useState({});

  // Calcular porcentaje de placa
  const calcularPorcentajePlaca = () => {
    const totalSectores = Object.keys(dientesSeleccionados).length;
    const sectoresSeleccionados = Object.values(dientesSeleccionados).filter(Boolean).length;
    return totalSectores > 0 ? Math.round((sectoresSeleccionados / totalSectores) * 100) : 0;
  };

  // Calcular porcentaje total de dientes
  const calcularPorcentajeTotal = () => {
    const totalDientes = 32; // 32 dientes permanentes
    const dientesConPlaca = new Set();
    
    Object.keys(dientesSeleccionados).forEach(key => {
      if (dientesSeleccionados[key]) {
        const numeroDiente = key.split('-')[0];
        dientesConPlaca.add(numeroDiente);
      }
    });
    
    return Math.round((dientesConPlaca.size / totalDientes) * 100);
  };

  // Establecer fecha actual por defecto
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFechaRegistro(today);
  }, []);

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

  // Funciones para el índice de sarro
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

  const calcularPorcentajeSarro = () => {
    const todosLosDientes = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28, 48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
    
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

  return (
    <div className="periodoncia-container">
      <div className="periodoncia-header">
        <h1>Periodoncia</h1>
      </div>
      
      <div className="periodoncia-content">
        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label>Paciente:</label>
              <select 
                value={selectedPaciente} 
                onChange={(e) => setSelectedPaciente(e.target.value)}
                className="form-select"
              >
                <option value="">Seleccionar paciente</option>
                <option value="1">Paciente 1</option>
                <option value="2">Paciente 2</option>
                <option value="3">Paciente 3</option>
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
          </div>

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

          <div className="indice-placa-section">
            <h3>Índice de Placa</h3>
            <div className="odontograma-permanente">
              {/* Fila superior - dientes 18-11 y 21-28 en una sola línea */}
              <div className="fila-dientes-superior">
                {[18, 17, 16, 15, 14, 13, 12, 11].map(numero => (
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
                ))}
                {[21, 22, 23, 24, 25, 26, 27, 28].map(numero => (
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
                ))}
              </div>

              {/* Fila inferior - dientes 48-41 y 31-38 en una sola línea */}
              <div className="fila-dientes-inferior">
                {[48, 47, 46, 45, 44, 43, 42, 41].map(numero => (
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
                ))}
                {[31, 32, 33, 34, 35, 36, 37, 38].map(numero => (
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
                ))}
              </div>
            </div>
            
            <div className="indice-placa-info">
              <div className="porcentaje-item">
                <span className="porcentaje-label">Índice de placa por dientes:</span>
                <span className="porcentaje-valor">{calcularPorcentajeTotal()}%</span>
              </div>
            </div>
          </div>

          {/* Sección: Índice de Sarro */}
          <div className="indice-sarro-section">
            <h3>Índice de Sarro</h3>
            <div className="odontograma-sarro">
              {/* Fila superior - dientes 18-11 y 21-28 en una sola línea */}
              <div className="fila-dientes-superior">
                {[18, 17, 16, 15, 14, 13, 12, 11].map(numero => (
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
                ))}
                {[21, 22, 23, 24, 25, 26, 27, 28].map(numero => (
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
                ))}
              </div>

              {/* Fila inferior - dientes 48-41 y 31-38 en una sola línea */}
              <div className="fila-dientes-inferior">
                {[48, 47, 46, 45, 44, 43, 42, 41].map(numero => (
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
                ))}
                {[31, 32, 33, 34, 35, 36, 37, 38].map(numero => (
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
                ))}
              </div>
            </div>
            
            <div className="indice-sarro-info">
              <div className="porcentaje-item">
                <span className="porcentaje-label">Índice de sarro:</span>
                <span className="porcentaje-valor">{calcularPorcentajeSarro()}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Periodoncia; 