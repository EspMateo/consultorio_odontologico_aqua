import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Odontograma.css';

const Odontograma = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [dientes, setDientes] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState('sano');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [tipoDenticion, setTipoDenticion] = useState('permanente');

  // Estados posibles para los dientes
  const condiciones = {
    sano: { nombre: 'Sano', color: '#4CAF50', descripcion: 'Diente en buen estado' },
    caries: { nombre: 'Caries', color: '#FF9800', descripcion: 'Caries detectada' },
    empaste: { nombre: 'Empaste', color: '#2196F3', descripcion: 'Diente con empaste' },
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

  // Configuración de los dientes (32 dientes total)
  const configuracionDientes = {
    superior: {
      derecha: [18, 17, 16, 15, 14, 13, 12, 11], // 8 dientes
      izquierda: [21, 22, 23, 24, 25, 26, 27, 28] // 8 dientes
    },
    inferior: {
      derecha: [48, 47, 46, 45, 44, 43, 42, 41], // 8 dientes
      izquierda: [31, 32, 33, 34, 35, 36, 37, 38] // 8 dientes
    }
  };

  // Determinar si un diente es premolar o molar (tiene 5 caras)
  const esDienteConOclusal = (numero) => {
    // Premolares: 14, 15, 24, 25, 34, 35, 44, 45
    // Molares: 16, 17, 18, 26, 27, 28, 36, 37, 38, 46, 47, 48
    const premolares = [14, 15, 24, 25, 34, 35, 44, 45];
    const molares = [16, 17, 18, 26, 27, 28, 36, 37, 38, 46, 47, 48];
    return premolares.includes(numero) || molares.includes(numero);
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

  useEffect(() => {
    const fetchPacienteData = async () => {
      try {
        // Obtener datos del paciente desde el estado de navegación o hacer una petición
        let pacienteData;
        if (location.state?.paciente) {
          pacienteData = location.state.paciente;
        } else {
          const response = await axios.get(`http://localhost:8080/api/pacientes/${id}`);
          pacienteData = response.data;
        }
        
        setPaciente({
          id: pacienteData.id,
          nombre: `${pacienteData.name} ${pacienteData.lastname}`,
          fecha: new Date().toLocaleDateString()
        });
        
        // Inicializar todos los dientes con sus partes como sanas
        const dientesIniciales = {};
        Object.values(configuracionDientes).forEach(arcada => {
          Object.values(arcada).forEach(lado => {
            lado.forEach(numero => {
              dientesIniciales[numero] = obtenerPartesDiente(numero);
            });
          });
        });
        setDientes(dientesIniciales);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar datos del paciente:', error);
        setMessage('Error al cargar los datos del paciente');
        setLoading(false);
      }
    };

    fetchPacienteData();
  }, [id, location.state]);

  const handleToothPartClick = (numeroDiente, parte) => {
    setSelectedTooth(numeroDiente);
    setSelectedPart(parte);
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
    }
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      // Aquí puedes implementar la lógica para guardar en el backend
      // Por ahora solo simulamos el guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Odontograma guardado exitosamente');
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error al guardar:', error);
      setMessage('Error al guardar el odontograma');
    } finally {
      setSaving(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedTooth(null);
    setSelectedPart(null);
    setSelectedCondition('sano');
  };

  const handleTipoDenticionChange = (tipo) => {
    setTipoDenticion(tipo);
  };

  const handleExportOdontograma = () => {
    // Implementar exportación del odontograma
    const odontogramaData = {
      paciente: paciente,
      dientes: dientes,
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

  // Utilidad para contraste de color de letra
  function getContrastingTextColor(bgColor) {
    if (!bgColor) return '#000';
    const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#222' : '#fff';
  }

  // Definir los sectores para todos los dientes (siempre 4 en el círculo exterior)
  const sectoresDiente = [
    { key: 'vestibular', label: 'V', angle: [0, 90] },
    { key: 'mesial', label: 'M', angle: [90, 180] },
    { key: 'palatal', label: 'P', angle: [180, 270] },
    { key: 'distal', label: 'D', angle: [270, 360] }
  ];

  const renderTooth = (numero) => {
    const dienteData = dientes[numero] || {};
    const isSelected = selectedTooth === numero;
    const tieneOclusal = esDienteConOclusal(numero);
    const size = 64;
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
      <div key={numero} className={`diente-circular ${isSelected ? 'selected' : ''}`}> 
        <div className="diente-numero">{numero}</div>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="diente-svg">
          {/* Sectores exteriores (siempre 4) */}
          {sectores.map((sector, idx) => (
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
          {sectores.map((sector, idx) => {
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

  const renderArcada = (arcada, nombre) => {
    return (
      <div className={`arcada ${nombre}`}>
        <h3 className="titulo-arcada">{nombre === 'superior' ? 'Arcada Superior' : 'Arcada Inferior'}</h3>
        <div className="dientes-container">
          <div className="lado-derecho">
            <h4>Derecha</h4>
            <div className="dientes-fila">
              {arcada.derecha.map(numero => renderTooth(numero))}
            </div>
          </div>
          <div className="lado-izquierdo">
            <h4>Izquierda</h4>
            <div className="dientes-fila">
              {arcada.izquierda.map(numero => renderTooth(numero))}
            </div>
          </div>
        </div>
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
    <div className="odontograma-container">
      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
          <button onClick={() => setMessage(null)} className="message-close">×</button>
        </div>
      )}
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

      <div className="odontograma-content">
        <div className="odontograma-main">
          {renderArcada(configuracionDientes.superior, 'superior')}
          {renderArcada(configuracionDientes.inferior, 'inferior')}
        </div>

        <div className="odontograma-sidebar">
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

          <div className="partes-diente-panel">
            <h3>Partes del Diente</h3>
            <div className="partes-diente-lista">
              {Object.entries(partesDiente).map(([key, parte]) => (
                <div
                  key={key}
                  className={`parte-diente-item ${selectedPart === key ? 'selected' : ''}`}
                >
                  <div className="parte-diente-color"></div>
                  <div className="parte-diente-info">
                    <span className="parte-diente-nombre">{parte.nombre}</span>
                    <span className="parte-diente-descripcion">{parte.descripcion}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="partes-info">
              <p><strong>Nota:</strong> Los premolares y molares tienen 5 caras (incluyendo oclusal), mientras que los demás dientes tienen 4 caras.</p>
            </div>
          </div>

          {selectedTooth && selectedPart && (
            <div className="diente-seleccionado">
              <h3>Diente Seleccionado: {selectedTooth}</h3>
              <p>Parte: <strong>{partesDiente[selectedPart]?.nombre}</strong></p>
              <p>Estado actual: <strong>{condiciones[dientes[selectedTooth]?.[selectedPart]]?.nombre}</strong></p>
              <p>Haz clic en un estado para cambiarlo</p>
            </div>
          )}

          <div className="acciones-panel">
            <h3>Acciones</h3>
            <button 
              className="btn-guardar" 
              onClick={handleSaveChanges}
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button 
              className="btn-limpiar" 
              onClick={handleClearSelection}
            >
              Limpiar Selección
            </button>
            <button 
              className="btn-exportar" 
              onClick={handleExportOdontograma}
            >
              Exportar Odontograma
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Odontograma; 