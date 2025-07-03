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
        
        // Inicializar todos los dientes como sanos
        const dientesIniciales = {};
        Object.values(configuracionDientes).forEach(arcada => {
          Object.values(arcada).forEach(lado => {
            lado.forEach(numero => {
              dientesIniciales[numero] = 'sano';
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

  const handleToothClick = (numeroDiente) => {
    setSelectedTooth(numeroDiente);
  };

  const handleConditionChange = (condicion) => {
    if (selectedTooth) {
      setDientes(prev => ({
        ...prev,
        [selectedTooth]: condicion
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

  const renderTooth = (numero, condicion) => {
    const isSelected = selectedTooth === numero;
    const color = condiciones[condicion]?.color || '#4CAF50';
    
    return (
      <div
        key={numero}
        className={`diente ${isSelected ? 'selected' : ''}`}
        style={{ backgroundColor: color }}
        onClick={() => handleToothClick(numero)}
        title={`Diente ${numero}: ${condiciones[condicion]?.nombre}`}
      >
        <span className="numero-diente">{numero}</span>
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
              {arcada.derecha.map(numero => renderTooth(numero, dientes[numero]))}
            </div>
          </div>
          <div className="lado-izquierdo">
            <h4>Izquierda</h4>
            <div className="dientes-fila">
              {arcada.izquierda.map(numero => renderTooth(numero, dientes[numero]))}
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

          {selectedTooth && (
            <div className="diente-seleccionado">
              <h3>Diente Seleccionado: {selectedTooth}</h3>
              <p>Estado actual: <strong>{condiciones[dientes[selectedTooth]]?.nombre}</strong></p>
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