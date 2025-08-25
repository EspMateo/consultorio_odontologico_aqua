import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { buildApiUrl } from '../../config';
import './Odontograma.css';

const Odontograma = () => {
  const { id } = useParams();
  const location = useLocation();
  
  // Estados principales
  const [paciente, setPaciente] = useState(null);
  const [dientes, setDientes] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState('sano');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [tipoDenticion, setTipoDenticion] = useState('permanente');
  const [observaciones, setObservaciones] = useState('');

  // Estados posibles para los dientes
  const condiciones = {
    sano: { nombre: 'Sano', color: '#4CAF50', descripcion: 'Diente en buen estado' },
    caries: { nombre: 'Caries', color: '#FF9800', descripcion: 'Caries detectada' },
    obturado: { nombre: 'Obturado', color: '#2196F3', descripcion: 'Diente obturado' },
    corona: { nombre: 'Corona', color: '#9C27B0', descripcion: 'Diente con corona' },
    extraido: { nombre: 'Extraído', color: '#F44336', descripcion: 'Diente extraído' },
    implante: { nombre: 'Implante', color: '#607D8B', descripcion: 'Implante dental' },
    tratamiento: { nombre: 'En Tratamiento', color: '#FF5722', descripcion: 'Diente en tratamiento' }
  };

  // Partes del diente
  const partesDiente = {
    vestibular: { nombre: 'Vestibular', descripcion: 'Cara externa del diente' },
    mesial: { nombre: 'Mesial', descripcion: 'Cara hacia la línea media' },
    distal: { nombre: 'Distal', descripcion: 'Cara alejada de la línea media' },
    palatal: { nombre: 'Palatal', descripcion: 'Cara hacia el paladar (superior)' },
    lingual: { nombre: 'Lingual', descripcion: 'Cara hacia la lengua (inferior)' },
    oclusal: { nombre: 'Oclusal', descripcion: 'Superficie de masticación' }
  };

  // Opciones de tipo de dentición
  const tiposDenticion = [
    { key: 'temporaria', label: 'Temporaria', descripcion: 'Dentición de leche' },
    { key: 'mixta', label: 'Mixta', descripcion: 'Dentición mixta' },
    { key: 'permanente', label: 'Permanente', descripcion: 'Dentición permanente' }
  ];

  // Números de dientes permanentes en el orden clásico
  const filaSuperiorDerecha = [18, 17, 16, 15, 14, 13, 12, 11];
  const filaSuperiorIzquierda = [21, 22, 23, 24, 25, 26, 27, 28];
  const filaInferiorDerecha = [48, 47, 46, 45, 44, 43, 42, 41];
  const filaInferiorIzquierda = [31, 32, 33, 34, 35, 36, 37, 38];

  // Números de dientes temporales (de leche)
  const filaSuperiorDerechaTemporal = [55, 54, 53, 52, 51];
  const filaSuperiorIzquierdaTemporal = [61, 62, 63, 64, 65];
  const filaInferiorDerechaTemporal = [85, 84, 83, 82, 81];
  const filaInferiorIzquierdaTemporal = [71, 72, 73, 74, 75];

  // Determinar si un diente es premolar o molar (tiene 5 caras)
  const esDienteConOclusal = (numero) => {
    const premolares = [14, 15, 24, 25, 34, 35, 44, 45];
    const molares = [16, 17, 18, 26, 27, 28, 36, 37, 38, 46, 47, 48];
    // Para dientes temporales, solo los molares tienen oclusal
    const molaresTemporales = [55, 54, 65, 64, 75, 74, 85, 84];
    return premolares.includes(numero) || molares.includes(numero) || molaresTemporales.includes(numero);
  };

  // Determinar si un diente es temporal
  const esDienteTemporal = (numero) => {
    const dientesTemporales = [
      ...filaSuperiorDerechaTemporal, ...filaSuperiorIzquierdaTemporal,
      ...filaInferiorDerechaTemporal, ...filaInferiorIzquierdaTemporal
    ];
    return dientesTemporales.includes(numero);
  };

  // Obtener las partes de un diente específico
  const obtenerPartesDiente = (numero) => {
    if (esDienteConOclusal(numero)) {
      return {
        vestibular: 'sano',
        mesial: 'sano',
        distal: 'sano',
        palatal: 'sano',
        oclusal: 'sano'
      };
    } else {
      return {
        vestibular: 'sano',
        mesial: 'sano',
        distal: 'sano',
        palatal: 'sano'
      };
    }
  };

  // Utilidad para contraste de color de letra
  const getContrastingTextColor = (bgColor) => {
    if (!bgColor) return '#000';
    const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#222' : '#fff';
  };

  // Definir los sectores para todos los dientes (siempre 4 en el círculo exterior)
  const sectoresDiente = [
    { key: 'vestibular', label: 'V', angle: [0, 90] },
    { key: 'mesial', label: 'M', angle: [90, 180] },
    { key: 'palatal', label: 'P', angle: [180, 270] },
    { key: 'distal', label: 'D', angle: [270, 360] }
  ];

  useEffect(() => {
    const fetchPacienteData = async () => {
      try {
        let pacienteData;
        if (location.state?.paciente) {
          pacienteData = location.state.paciente;
        } else {
          const response = await axios.get(buildApiUrl(`pacientes/${id}`));
          pacienteData = response.data;
        }
        
        setPaciente({
          id: pacienteData.id,
          nombre: `${pacienteData.name} ${pacienteData.lastname}`,
          fecha: new Date().toLocaleDateString()
        });
        
        // Cargar el odontograma más reciente del paciente
        await cargarOdontogramaMasReciente(pacienteData.id);
        
        setLoading(false);
      } catch (error) {
        setMessage('Error al cargar los datos del paciente');
        setLoading(false);
      }
    };

    fetchPacienteData();
  }, [id, location.state]);

  // Función para cargar el odontograma más reciente
  const cargarOdontogramaMasReciente = async (pacienteId) => {
    try {
      const response = await axios.get(buildApiUrl(`odontogramas/paciente/${pacienteId}/reciente`));
      const odontograma = response.data;
      
      if (odontograma) {
        // Cargar los datos del odontograma
        setTipoDenticion(odontograma.tipoDenticion || 'permanente');
        setObservaciones(odontograma.observaciones || '');
        
        // Parsear los datos de los dientes desde JSON
        if (odontograma.datosDientes) {
          try {
            const datosDientes = JSON.parse(odontograma.datosDientes);
            
            // Preservar todos los datos guardados, incluyendo dientes temporales
            const dientesCompletos = {};
            const todosLosDientes = [
              ...filaSuperiorDerecha, ...filaSuperiorIzquierda, 
              ...filaInferiorDerecha, ...filaInferiorIzquierda,
              ...filaSuperiorDerechaTemporal, ...filaSuperiorIzquierdaTemporal,
              ...filaInferiorDerechaTemporal, ...filaInferiorIzquierdaTemporal
            ];
            
            // Cargar todos los dientes guardados
            todosLosDientes.forEach(numero => {
              if (datosDientes[numero]) {
                dientesCompletos[numero] = datosDientes[numero];
              } else {
                dientesCompletos[numero] = obtenerPartesDiente(numero);
              }
            });
            
            setDientes(dientesCompletos);
          } catch (parseError) {
            // Si hay error al parsear, inicializar dientes vacíos
            inicializarDientesVacios();
          }
        } else {
          inicializarDientesVacios();
        }
      } else {
        // Si no hay odontograma guardado, inicializar vacío
        inicializarDientesVacios();
      }
    } catch (error) {
      // Si hay error, inicializar dientes vacíos
      inicializarDientesVacios();
    }
  };

  // Función para inicializar dientes vacíos
  const inicializarDientesVacios = () => {
    const dientesIniciales = {};
    const todosLosDientes = [
      ...filaSuperiorDerecha, ...filaSuperiorIzquierda, 
      ...filaInferiorDerecha, ...filaInferiorIzquierda,
      ...filaSuperiorDerechaTemporal, ...filaSuperiorIzquierdaTemporal,
      ...filaInferiorDerechaTemporal, ...filaInferiorIzquierdaTemporal
    ];
    
    // Inicializar todos los dientes
    todosLosDientes.forEach(numero => {
      dientesIniciales[numero] = obtenerPartesDiente(numero);
    });
    
    setDientes(dientesIniciales);
  };

  const handleToothPartClick = (numeroDiente, parte) => {
    setSelectedTooth(numeroDiente);
    setSelectedPart(parte);
    setMessage(null);
  };

  const handleConditionChange = (condicion) => {
    if (selectedTooth && selectedPart) {
      setDientes(prev => ({
        ...prev,
        [selectedTooth]: {
          ...prev[selectedTooth],
          [selectedPart]: condicion
        }
      }));
      setSelectedCondition(condicion);
      setMessage(null);
    }
  };

  const handleSaveChanges = async () => {
    if (!paciente?.id) {
      setMessage('Error: No se pudo identificar al paciente');
      return;
    }

    setSaving(true);
    try {
      const odontogramaData = {
        pacienteId: paciente.id,
        tipoDenticion: tipoDenticion,
        datosDientes: dientes,
        observaciones: observaciones || 'Odontograma actualizado'
      };

      const response = await axios.post(buildApiUrl('odontogramas'), odontogramaData);
      
      setMessage('Odontograma guardado exitosamente');
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage('Error al guardar el odontograma: ' + (error.response?.data || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedTooth(null);
    setSelectedPart(null);
    setSelectedCondition('sano');
    setMessage(null);
  };

  const handleTipoDenticionChange = (tipo) => {
    setTipoDenticion(tipo);
    setMessage(null);
    
    // Preservar datos existentes y solo agregar dientes temporales si es necesario
    const dientesActuales = { ...dientes };
    const dientesTemporales = [
      ...filaSuperiorDerechaTemporal, ...filaSuperiorIzquierdaTemporal,
      ...filaInferiorDerechaTemporal, ...filaInferiorIzquierdaTemporal
    ];
    
    // Si cambia a temporaria o mixta, agregar dientes temporales si no existen
    if (tipo === 'temporaria' || tipo === 'mixta') {
      dientesTemporales.forEach(numero => {
        if (!dientesActuales[numero]) {
          dientesActuales[numero] = obtenerPartesDiente(numero);
        }
      });
    }
    
    setDientes(dientesActuales);
  };

  const handleExportOdontograma = () => {
    const odontogramaData = {
      paciente: paciente,
      dientes: dientes,
      tipoDenticion: tipoDenticion,
      observaciones: observaciones,
      fecha: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(odontogramaData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `odontograma_${paciente?.nombre.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Función para recargar el odontograma más reciente
  const handleRecargarOdontograma = async () => {
    if (!paciente?.id) {
      setMessage('Error: No se pudo identificar al paciente');
      return;
    }

    setLoading(true);
    try {
      await cargarOdontogramaMasReciente(paciente.id);
      setMessage('Odontograma recargado exitosamente');
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage('Error al recargar el odontograma');
    } finally {
      setLoading(false);
    }
  };

  const renderTooth = (numero) => {
    const dienteData = dientes[numero] || {};
    const isSelected = selectedTooth === numero;
    const tieneOclusal = esDienteConOclusal(numero);
    const esTemporal = esDienteTemporal(numero);
    const size = esTemporal ? 56 : 64; // Tamaño original
    const center = size / 2;
    const radius = size / 2 - 2;
    const oclusalRadius = size / 4;
    const sectores = sectoresDiente;

    // Colores de fondo para cada cara
    const getColor = (key) => condiciones[dienteData[key]]?.color || '#4CAF50';
    const getText = (key) => getContrastingTextColor(getColor(key));

    // Función para crear un sector SVG
    function describeArc(cx, cy, r, startAngle, endAngle) {
      const start = polarToCartesian(cx, cy, r, endAngle);
      const end = polarToCartesian(cx, cy, r, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
      return [
        'M', cx, cy,
        'L', start.x, start.y,
        'A', r, r, 0, largeArcFlag, 0, end.x, end.y,
        'Z'
      ].join(' ');
    }
    function polarToCartesian(cx, cy, r, angle) {
      const rad = (angle - 90) * Math.PI / 180.0;
      return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad)
      };
    }

    return (
      <div key={numero} className={`diente-circular ${isSelected ? 'selected' : ''} ${esTemporal ? 'diente-temporal' : ''}`}> 
        <div className={`diente-numero ${esTemporal ? 'numero-temporal' : ''}`}>{numero}</div>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={`diente-svg ${esTemporal ? 'svg-temporal' : ''}`}>
          {/* Sectores exteriores (siempre 4) */}
          {sectores.map((sector) => (
            <path
              key={sector.key}
              d={describeArc(center, center, radius, sector.angle[0], sector.angle[1])}
              fill={getColor(sector.key)}
              className={`sector-diente sector-${sector.key} ${(selectedTooth === numero && selectedPart === sector.key) ? 'selected' : ''}`}
              onClick={() => handleToothPartClick(numero, sector.key)}
            />
          ))}
          {/* Oclusal (centro) solo para premolares/molares */}
          {tieneOclusal && (
            <circle
              cx={center}
              cy={center}
              r={oclusalRadius}
              fill={getColor('oclusal')}
              className={`sector-diente sector-oclusal ${(selectedTooth === numero && selectedPart === 'oclusal') ? 'selected' : ''}`}
              onClick={() => handleToothPartClick(numero, 'oclusal')}
            />
          )}
          {/* Letras */}
          {sectores.map((sector) => {
            // Calcular ángulo medio para posicionar la letra
            const angle = (sector.angle[0] + sector.angle[1]) / 2;
            const rad = (angle - 90) * Math.PI / 180.0;
            const r = tieneOclusal ? (radius + oclusalRadius) / 2 : radius * 0.65;
            const x = center + r * Math.cos(rad);
            const y = center + r * Math.sin(rad) + 5;
            return (
              <text
                key={sector.key}
                x={x}
                y={y}
                textAnchor="middle"
                fontSize="16"
                fontWeight="bold"
                fill={getText(sector.key)}
                pointerEvents="none"
              >{sector.label}</text>
            );
          })}
          {/* Letra O en el centro si tiene oclusal */}
          {tieneOclusal && (
            <text
              x={center}
              y={center + 5}
              textAnchor="middle"
              fontSize="16"
              fontWeight="bold"
              fill={getText('oclusal')}
              pointerEvents="none"
            >O</text>
          )}
        </svg>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="odontograma-loading">
        <div className="spinner"></div>
        <p>Cargando odontograma...</p>
      </div>
    );
  }

  return (
    <div className="odontograma-container odontograma-vertical">
      <div className="odontograma-header">
        <h1>Odontograma del Paciente</h1>
        {paciente && (
          <div className="paciente-info">
            <p><strong>Nombre:</strong> {paciente.nombre}</p>
            <p><strong>Fecha:</strong> {paciente.fecha}</p>
          </div>
        )}
        
        {/* Sección de Tipo de Dentición */}
        <div className="tipo-denticion-section">
          <h3>Tipo de Dentición</h3>
          <div className="tipo-denticion-options">
            {tiposDenticion.map((tipo) => (
              <div
                key={tipo.key}
                className={`tipo-denticion-option ${tipoDenticion === tipo.key ? 'selected' : ''}`}
                onClick={() => handleTipoDenticionChange(tipo.key)}
              >
                <div className="tipo-denticion-square"></div>
                <div className="tipo-denticion-info">
                  <span className="tipo-denticion-label">{tipo.label}</span>
                  <span className="tipo-denticion-descripcion">{tipo.descripcion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="odontograma-main">
        {/* Botón limpiar selección (esquina superior izquierda) */}
        <button
          className="btn-icon limpiar-icon"
          title="Limpiar selección"
          onClick={handleClearSelection}
          type="button"
        >
          🧹
        </button>
        {/* Botón recargar odontograma (esquina superior derecha) */}
        <button
          className="btn-icon recargar-icon"
          title="Recargar odontograma"
          onClick={handleRecargarOdontograma}
          type="button"
        >
          ⟳
        </button>
        {/* Fila superior permanente */}
        <div className="fila-dientes">
          {filaSuperiorDerecha.map(num => renderTooth(num))}
          <div style={{ width: 40 }} />
          {filaSuperiorIzquierda.map(num => renderTooth(num))}
        </div>
        {/* Fila superior temporal - solo mostrar si es temporaria o mixta */}
        {(tipoDenticion === 'temporaria' || tipoDenticion === 'mixta') && (
          <div className="fila-dientes fila-temporal">
            {filaSuperiorDerechaTemporal.map(num => renderTooth(num))}
            <div style={{ width: 40 }} />
            {filaSuperiorIzquierdaTemporal.map(num => renderTooth(num))}
          </div>
        )}
        {/* Fila inferior temporal - solo mostrar si es temporaria o mixta */}
        {(tipoDenticion === 'temporaria' || tipoDenticion === 'mixta') && (
          <div className="fila-dientes fila-temporal">
            {filaInferiorDerechaTemporal.map(num => renderTooth(num))}
            <div style={{ width: 40 }} />
            {filaInferiorIzquierdaTemporal.map(num => renderTooth(num))}
          </div>
        )}
        {/* Fila inferior permanente */}
        <div className="fila-dientes">
          {filaInferiorDerecha.map(num => renderTooth(num))}
          <div style={{ width: 40 }} />
          {filaInferiorIzquierda.map(num => renderTooth(num))}
        </div>
      </div>
      {/* Sección: Estados de los Dientes */}
      <div className="odontograma-section">
        <div className="condiciones-panel">
          <h3>Estados de los Dientes</h3>
          <div className="condiciones-lista">
            {Object.entries(condiciones).map(([key, condicion]) => (
              <div
                key={key}
                className={`condicion-item ${selectedCondition === key ? 'selected' : ''}`}
                onClick={() => handleConditionChange(key)}
              >
                <div 
                  className="condicion-color" 
                  style={{ backgroundColor: condicion.color }}
                ></div>
                <div className="condicion-info">
                  <span className="condicion-nombre">{condicion.nombre}</span>
                  <span className="condicion-descripcion">{condicion.descripcion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sección: Observaciones y Diente Seleccionado en la misma línea */}
      <div className="odontograma-section odontograma-row">
        {/* Observaciones a la izquierda */}
        <div className="observaciones-panel">
          <h3>Observaciones</h3>
          <textarea
            value={observaciones}
            onChange={(e) => {
              setObservaciones(e.target.value);
              setMessage(null);
            }}
            placeholder="Agregar observaciones sobre el odontograma..."
            rows="3"
            className="observaciones-textarea"
          />
        </div>
        
        {/* Diente Seleccionado a la derecha */}
        {selectedTooth && selectedPart && (
          <div className="diente-seleccionado" style={{ minWidth: 220 }}>
            <h3>Diente Seleccionado: {selectedTooth}</h3>
            <p>Parte: <strong>{partesDiente[selectedPart]?.nombre}</strong></p>
            <p>Estado actual: <strong>{condiciones[dientes[selectedTooth]?.[selectedPart]]?.nombre}</strong></p>
            <p>Haz clic en un estado para cambiarlo</p>
          </div>
        )}
      </div>

      {/* Sección: Acciones */}
      <div className="odontograma-section">
        <div className="acciones-panel">
          <h3>Acciones</h3>
          {message && (
            <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
          <div className="acciones-buttons">
            <button 
              className="btn-guardar" 
              onClick={handleSaveChanges}
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button 
              className="btn-exportar" 
              onClick={handleExportOdontograma}
            >
              Exportar Odontograma
            </button>
            <button 
              className="btn-volver" 
              onClick={() => window.history.back()}
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Odontograma; 