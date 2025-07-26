import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { buildApiUrl } from '../../config';
import MessageDisplay from '../MessageDisplay';
import './Periodontograma.css';

// Constantes para los dientes
const DIENTES_SUPERIORES = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const DIENTES_INFERIORES = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
const DIENTES_FURCA = [14, 15, 16, 17, 18, 24, 25, 26, 27, 28];

// Estados iniciales para cada diente
const getInitialDienteState = () => ({
  pronostico: '', // D, F, R - COMPARTIDO
  condicionMucogingival: '', // R, FA, V, F, O - COMPARTIDO
  movilidad: 0, // 0-3 - COMPARTIDO
  profundidadSondaje: {
    vestibular: {
      mesial: 0,
      vestibular: 0,
      distal: 0,
      lingual: 0
    },
    palatina: {
      mesial: 0,
      palatino: 0,
      distal: 0,
      lingual: 0
    }
  },
  migracionGingival: {
    vestibular: {
      mesial: 0,
      vestibular: 0,
      distal: 0,
      lingual: 0
    },
    palatina: {
      mesial: 0,
      palatino: 0,
      distal: 0,
      lingual: 0
    }
  },
  sangrado: {
    mesial: false,
    vestibular: false,
    distal: false,
    lingual: false
  },
  sangradoGeneral: false, // COMPARTIDO
  lesionFurca: 0, // 0-4 (solo para dientes específicos) - COMPARTIDO
  ausente: false, // COMPARTIDO
  nota: '', // Nota personalizada - COMPARTIDO
  tipoNota: '' // RDF, SSR, RF - COMPARTIDO
});

const Periodontograma = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estados principales
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paciente, setPaciente] = useState(null);
  const [periodontogramaId, setPeriodontogramaId] = useState(null);
  const [fechaUltimaActualizacion, setFechaUltimaActualizacion] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Estados de notificación
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [displayMessage, setDisplayMessage] = useState(null);
  const [messageType, setMessageType] = useState('info');
  
  // Estados del periodontograma
  const [dientes, setDientes] = useState({});
  const [dientesAusentes, setDientesAusentes] = useState(new Set());
  const [observaciones, setObservaciones] = useState('');
  const [odontogramaData, setOdontogramaData] = useState(null);
  
  // Estados de UI
  const [selectedDiente, setSelectedDiente] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [showDienteModal, setShowDienteModal] = useState(false);
  
  // Estado para la vista (vestibular/palatina)
  const [vistaActual, setVistaActual] = useState('vestibular'); // 'vestibular' o 'palatina'
  
  // Estado para el cuadrante seleccionado
  const [cuadranteSeleccionado, setCuadranteSeleccionado] = useState('todos'); // 'todos', 'superior-derecho', 'superior-izquierdo', 'inferior-derecho', 'inferior-izquierdo'
  
  // Definir cuadrantes
  const cuadrantes = {
    'todos': { nombre: 'Todos los dientes', dientes: [...DIENTES_SUPERIORES, ...DIENTES_INFERIORES] },
    'superior-derecho': { nombre: 'Superior Derecho (11-18)', dientes: [18, 17, 16, 15, 14, 13, 12, 11] },
    'superior-izquierdo': { nombre: 'Superior Izquierdo (21-28)', dientes: [21, 22, 23, 24, 25, 26, 27, 28] },
    'inferior-derecho': { nombre: 'Inferior Derecho (41-48)', dientes: [48, 47, 46, 45, 44, 43, 42, 41] },
    'inferior-izquierdo': { nombre: 'Inferior Izquierdo (31-38)', dientes: [31, 32, 33, 34, 35, 36, 37, 38] }
  };

  useEffect(() => {
    if (location.state?.paciente) {
      setPaciente(location.state.paciente);
      setLoading(false);
      fetchPeriodontograma(location.state.paciente.id);
    } else {
      fetchPaciente();
    }
  }, [id, location.state]);

  const fetchPaciente = async () => {
    setLoading(true);
    try {
      const response = await axios.get(buildApiUrl(`pacientes/${id}`));
      setPaciente(response.data);
      fetchPeriodontograma(response.data.id);
    } catch (error) {
      console.error('Error al cargar paciente:', error);
      setError('Error al cargar los datos del paciente');
    } finally {
      setLoading(false);
    }
  };

  const fetchPeriodontograma = async (pacienteId) => {
    // Primero cargar datos del odontograma para verificar dientes ausentes
    let dientesAusentesOdontograma = new Set();
    try {
      const odontogramaResponse = await axios.get(buildApiUrl(`odontogramas/paciente/${pacienteId}/reciente`));
      if (odontogramaResponse.data) {
        setOdontogramaData(odontogramaResponse.data);
        // Marcar dientes ausentes del odontograma
        if (odontogramaResponse.data.datosDientes) {
          // Parsear el JSON string a objeto
          let datosDientes;
          try {
            datosDientes = typeof odontogramaResponse.data.datosDientes === 'string' 
              ? JSON.parse(odontogramaResponse.data.datosDientes)
              : odontogramaResponse.data.datosDientes;
          } catch (e) {
            console.error('Error parsing datosDientes:', e);
            datosDientes = {};
          }
          
          Object.entries(datosDientes).forEach(([numero, diente]) => {
            if (diente && diente.ausente) {
              dientesAusentesOdontograma.add(parseInt(numero));
            }
          });
        }
      }
    } catch (error) {
      console.log('No se encontró odontograma para este paciente');
    }

    // Luego cargar el periodontograma
    try {
      const response = await axios.get(buildApiUrl(`periodontograma/paciente/${pacienteId}/reciente`));
      if (response.data && response.data.id) {
        setPeriodontogramaId(response.data.id);
        setFechaUltimaActualizacion(response.data.fechaModificacion || response.data.fechaCreacion);
        loadPeriodontogramaData(response.data, dientesAusentesOdontograma);
      } else {
        initializeDientes();
        // Si no hay periodontograma, usar los dientes ausentes del odontograma
        setDientesAusentes(dientesAusentesOdontograma);
      }
    } catch (error) {
      // Si no hay periodontograma, inicializar con valores por defecto
      initializeDientes();
      // Usar los dientes ausentes del odontograma
      setDientesAusentes(dientesAusentesOdontograma);
    }
  };

  const initializeDientes = () => {
    const dientesIniciales = {};
    [...DIENTES_SUPERIORES, ...DIENTES_INFERIORES].forEach(numero => {
      dientesIniciales[numero] = getInitialDienteState();
    });
    setDientes(dientesIniciales);
  };

  const loadPeriodontogramaData = (data, dientesAusentesOdontograma = new Set()) => {
    if (data.datosPeriodontograma) {
      const datos = data.datosPeriodontograma;
      if (datos.dientes) {
        // Convertir datos antiguos a nueva estructura si es necesario
        const dientesConvertidos = {};
        Object.entries(datos.dientes).forEach(([numero, diente]) => {
          if (diente) {
            // Si los datos tienen la estructura antigua, convertir a la nueva
            if (diente.profundidadSondaje && !diente.profundidadSondaje.vestibular) {
              // Estructura antigua - convertir a nueva
              dientesConvertidos[numero] = {
                ...diente,
                profundidadSondaje: {
                  vestibular: diente.profundidadSondaje || {},
                  palatina: diente.profundidadSondaje || {}
                },
                migracionGingival: {
                  vestibular: diente.migracionGingival || {},
                  palatina: diente.migracionGingival || {}
                }
              };
            } else {
              // Estructura nueva - usar tal como está
              dientesConvertidos[numero] = diente;
            }
          }
        });
        setDientes(dientesConvertidos);
      } else {
        initializeDientes();
      }
      
      // Combinar dientes ausentes del periodontograma con los del odontograma
      let dientesAusentesCombinados = new Set();
      
      // Agregar dientes ausentes del periodontograma
      if (datos.dientesAusentes) {
        dientesAusentesCombinados = new Set(datos.dientesAusentes);
      }
      
      // Agregar dientes ausentes del odontograma (no sobrescribir los del periodontograma)
      dientesAusentesOdontograma.forEach(diente => {
        dientesAusentesCombinados.add(diente);
      });
      
      setDientesAusentes(dientesAusentesCombinados);
      console.log('Dientes ausentes cargados:', Array.from(dientesAusentesCombinados));
    } else {
      initializeDientes();
      setDientesAusentes(dientesAusentesOdontograma);
      console.log('Dientes ausentes del odontograma:', Array.from(dientesAusentesOdontograma));
    }
    
    if (data.observaciones) {
      setObservaciones(data.observaciones);
    }
  };

  // Manejadores de eventos
  const handleDienteClick = useCallback((numeroDiente, sector = null) => {
    if (dientesAusentes.has(numeroDiente)) return;
    
    setSelectedDiente(numeroDiente);
    setSelectedSector(sector);
    setShowDienteModal(true);
  }, [dientesAusentes]);

  const handlePronosticoChange = useCallback((diente, valor) => {
    setDientes(prev => ({
      ...prev,
      [diente]: {
        ...prev[diente],
        pronostico: valor
      }
    }));
  }, []);

  const handleCondicionMucogingivalChange = useCallback((diente, valor) => {
    setDientes(prev => ({
      ...prev,
      [diente]: {
        ...prev[diente],
        condicionMucogingival: valor
      }
    }));
  }, []);

  const handleMovilidadChange = useCallback((diente, valor) => {
    setDientes(prev => ({
      ...prev,
      [diente]: {
        ...prev[diente],
        movilidad: parseInt(valor) || 0
      }
    }));
  }, []);

  const handleProfundidadSondajeChange = useCallback((diente, sector, valor) => {
    setDientes(prev => ({
      ...prev,
      [diente]: {
        ...prev[diente],
        profundidadSondaje: {
          ...prev[diente].profundidadSondaje,
          [vistaActual]: {
            ...prev[diente].profundidadSondaje[vistaActual],
            [sector]: parseInt(valor) || 0
          }
        }
      }
    }));
  }, [vistaActual]);

  const handleMigracionGingivalChange = useCallback((diente, sector, valor) => {
    setDientes(prev => ({
      ...prev,
      [diente]: {
        ...prev[diente],
        migracionGingival: {
          ...prev[diente].migracionGingival,
          [vistaActual]: {
            ...prev[diente].migracionGingival[vistaActual],
            [sector]: parseInt(valor) || 0
          }
        }
      }
    }));
  }, [vistaActual]);

  const handleNotaChange = useCallback((diente, valor) => {
    setDientes(prev => ({
      ...prev,
      [diente]: {
        ...prev[diente],
        nota: valor
      }
    }));
  }, []);

  const handleTipoNotaChange = useCallback((diente, valor) => {
    setDientes(prev => ({
      ...prev,
      [diente]: {
        ...prev[diente],
        tipoNota: valor
      }
    }));
  }, []);

  const handleSangradoClick = useCallback((diente, sector) => {
    setDientes(prev => {
      const currentSangrado = prev[diente].sangrado[sector];
      let newSangrado;
      
      if (!currentSangrado) {
        newSangrado = 'rojo'; // Primer click: rojo
      } else if (currentSangrado === 'rojo') {
        newSangrado = 'amarillo'; // Segundo click: amarillo
      } else {
        newSangrado = false; // Tercer click: sin sangrado
      }
      
      return {
        ...prev,
        [diente]: {
          ...prev[diente],
          sangrado: {
            ...prev[diente].sangrado,
            [sector]: newSangrado
          }
        }
      };
    });
  }, []);

  const handleSangradoGeneralClick = useCallback((diente) => {
    setDientes(prev => {
      const currentSangrado = prev[diente].sangradoGeneral;
      let newSangrado;
      
      if (!currentSangrado) {
        newSangrado = 'rojo'; // Primer click: rojo
      } else if (currentSangrado === 'rojo') {
        newSangrado = 'amarillo'; // Segundo click: amarillo
      } else {
        newSangrado = false; // Tercer click: sin sangrado
      }
      
      return {
        ...prev,
        [diente]: {
          ...prev[diente],
          sangradoGeneral: newSangrado
        }
      };
    });
  }, []);

  const handleLesionFurcaChange = useCallback((diente, valor) => {
    if (!DIENTES_FURCA.includes(diente)) return;
    
    setDientes(prev => ({
      ...prev,
      [diente]: {
        ...prev[diente],
        lesionFurca: parseInt(valor) || 0
      }
    }));
  }, []);

  const handleDienteAusente = useCallback((diente) => {
    setDientesAusentes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(diente)) {
        newSet.delete(diente);
        console.log(`Diente ${diente} marcado como presente`);
      } else {
        newSet.add(diente);
        console.log(`Diente ${diente} marcado como ausente`);
      }
      console.log('Nuevo conjunto de dientes ausentes:', Array.from(newSet));
      return newSet;
    });
  }, []);

  // Utilidades
  const showNotification = useCallback((type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  }, []);

  const getColorProfundidad = useCallback((valor) => {
    if (valor === 0) return 'transparent';
    if (valor <= 3) return '#4CAF50'; // Verde
    return '#F44336'; // Rojo
  }, []);

  const getColorSangrado = useCallback((valor) => {
    if (!valor) return 'transparent';
    if (valor === 'rojo') return '#F44336';
    if (valor === 'amarillo') return '#FF9800';
    return 'transparent';
  }, []);

  // Manejadores de acciones
  const handleCancel = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  const confirmCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!paciente?.id) {
      showNotification('error', 'No se pudo obtener el ID del paciente. Por favor, recargue la página.');
      setLoading(false);
      return;
    }

    const periodontogramaData = {
      pacienteId: paciente.id,
      fechaRegistro: new Date().toISOString().split('T')[0],
      datosPeriodontograma: {
        dientes: dientes,
        dientesAusentes: Array.from(dientesAusentes)
      },
      observaciones: observaciones
    };

    console.log('Dientes ausentes antes de guardar:', Array.from(dientesAusentes));
    console.log('Datos completos a enviar:', periodontogramaData);

    try {
      console.log('Enviando datos al backend:', periodontogramaData);
      let response;
      if (periodontogramaId) {
        response = await axios.put(buildApiUrl(`periodontograma/${periodontogramaId}`), periodontogramaData);
      } else {
        response = await axios.post(buildApiUrl('periodontograma'), periodontogramaData);
      }
      
      console.log('Respuesta del backend:', response.data);
      showNotification('success', '¡Periodontograma guardado con éxito!');
      if (response.data.fechaModificacion) {
        setFechaUltimaActualizacion(response.data.fechaModificacion);
      } else if (response.data.fechaCreacion) {
        setFechaUltimaActualizacion(response.data.fechaCreacion);
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Error al guardar el periodontograma';
      showNotification('error', `Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [
    paciente, dientes, dientesAusentes, observaciones, periodontogramaId,
    showNotification
  ]);

  const handleDismissMessage = useCallback(() => {
    setDisplayMessage(null);
    setMessageType('info');
  }, []);

  const closeDienteModal = useCallback(() => {
    setShowDienteModal(false);
    setSelectedDiente(null);
    setSelectedSector(null);
  }, []);

  // Componente para el rectángulo con rayitas
  const RayitasRectangulo = ({ profundidadSondaje, migracionGingival, vistaActual, numeroDiente }) => {
    const maxLineasPositivas = 12; // Cambiado de 10 a 12
    const maxLineasNegativas = 12; // Cambiado de 10 a 12
    const sectores = vistaActual === 'vestibular' 
      ? [
          { key: 'mesial', label: 'D' },
          { key: 'vestibular', label: 'V' },
          { key: 'distal', label: 'M' }
        ]
      : [
          { key: 'mesial', label: 'D' },
          { key: 'palatino', label: 'P' },
          { key: 'distal', label: 'M' }
        ];
    
    // Determinar si es diente superior o inferior
    const esDienteInferior = DIENTES_INFERIORES.includes(numeroDiente);
    
    const getLineasPorSector = (sector) => {
      const profundidad = profundidadSondaje[vistaActual]?.[sector] || 0;
      const migracion = migracionGingival[vistaActual]?.[sector] || 0;
      
      // Calcular rayitas positivas
      const rayitasProfundidad = Math.min(profundidad, maxLineasPositivas);
      const rayitasMigracionPositiva = migracion > 0 ? Math.min(migracion, maxLineasPositivas - rayitasProfundidad) : 0;
      
      // Calcular rayitas negativas (solo migración negativa)
      const rayitasMigracionNegativa = migracion < 0 ? Math.min(Math.abs(migracion), maxLineasNegativas) : 0;
      
      return {
        positivas: {
          profundidad: {
            cantidad: rayitasProfundidad,
            esRoja: profundidad > 3,
            tipo: 'profundidad',
            posicionInicial: rayitasMigracionPositiva // Empieza después de la migración
          },
          migracion: {
            cantidad: rayitasMigracionPositiva,
            tipo: 'migracion',
            posicionInicial: 0 // Empieza desde la línea divisoria
          },
          total: rayitasProfundidad + rayitasMigracionPositiva
        },
        negativas: {
          cantidad: rayitasMigracionNegativa,
          tipo: 'migracion-negativa'
        }
      };
    };
    
    return (
      <div className="rayitas-container">
        <div className="rayitas-label">Visualización</div>
        <div className="rayitas-rectangulo">
          {sectores.map((sector, sectorIndex) => {
            const lineasInfo = getLineasPorSector(sector.key);
            
            return (
              <div key={sector.key} className="rayitas-columna">
                <div className="rayitas-columna-label">{sector.label}</div>
                <div className="rayitas-columna-content">
                  {esDienteInferior ? (
                    // Visualización invertida para dientes inferiores
                    <>
                      {/* Líneas negativas (arriba) - para dientes inferiores */}
                      {[...Array(maxLineasNegativas)].reverse().map((_, index) => {
                        const originalIndex = maxLineasNegativas - 1 - index;
                        const isMigracionNegativa = originalIndex < lineasInfo.negativas.cantidad;
                        
                        let className = 'rayitas-linea';
                        if (isMigracionNegativa) {
                          className += ' activa-migracion-negativa';
                        }
                        
                        return (
                          <div key={`neg-${originalIndex}`} className={className}></div>
                        );
                      })}
                      
                      {/* Línea divisoria */}
                      <div className="rayitas-divisoria"></div>
                      
                      {/* Líneas positivas (abajo) - invertidas para dientes inferiores */}
                      {[...Array(maxLineasPositivas)].map((_, index) => {
                        const isProfundidad = index >= lineasInfo.positivas.profundidad.posicionInicial && 
                                             index < (lineasInfo.positivas.profundidad.posicionInicial + lineasInfo.positivas.profundidad.cantidad);
                        const isMigracion = index >= lineasInfo.positivas.migracion.posicionInicial && 
                                           index < (lineasInfo.positivas.migracion.posicionInicial + lineasInfo.positivas.migracion.cantidad);
                        
                        let className = 'rayitas-linea';
                        if (isProfundidad) {
                          className += ' activa';
                          if (lineasInfo.positivas.profundidad.esRoja) {
                            className += ' activa-roja';
                          } else {
                            className += ' activa-verde';
                          }
                        } else if (isMigracion) {
                          className += ' activa-migracion';
                        }
                        
                        return (
                          <div key={`pos-${index}`} className={className}></div>
                        );
                      })}
                    </>
                  ) : (
                    // Visualización normal para dientes superiores
                    <>
                      {/* Líneas positivas (arriba) - invertidas para empezar desde la línea divisoria */}
                      {[...Array(maxLineasPositivas)].reverse().map((_, index) => {
                        const originalIndex = maxLineasPositivas - 1 - index;
                        const isProfundidad = originalIndex >= lineasInfo.positivas.profundidad.posicionInicial && 
                                             originalIndex < (lineasInfo.positivas.profundidad.posicionInicial + lineasInfo.positivas.profundidad.cantidad);
                        const isMigracion = originalIndex >= lineasInfo.positivas.migracion.posicionInicial && 
                                           originalIndex < (lineasInfo.positivas.migracion.posicionInicial + lineasInfo.positivas.migracion.cantidad);
                        
                        let className = 'rayitas-linea';
                        if (isProfundidad) {
                          className += ' activa';
                          if (lineasInfo.positivas.profundidad.esRoja) {
                            className += ' activa-roja';
                          } else {
                            className += ' activa-verde';
                          }
                        } else if (isMigracion) {
                          className += ' activa-migracion';
                        }
                        
                        return (
                          <div key={`pos-${originalIndex}`} className={className}></div>
                        );
                      })}
                      
                      {/* Línea divisoria */}
                      <div className="rayitas-divisoria"></div>
                      
                      {/* Líneas negativas (abajo) */}
                      {[...Array(maxLineasNegativas)].map((_, index) => {
                        const isMigracionNegativa = index < lineasInfo.negativas.cantidad;
                        
                        let className = 'rayitas-linea';
                        if (isMigracionNegativa) {
                          className += ' activa-migracion-negativa';
                        }
                        
                        return (
                          <div key={`neg-${index}`} className={className}></div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="rayitas-leyenda">
          <span className="leyenda-item">
            <span className="leyenda-color verde"></span> Profundidad ≤3mm
          </span>
          <span className="leyenda-item">
            <span className="leyenda-color rojo"></span> Profundidad &gt;3mm
          </span>
          <span className="leyenda-item">
            <span className="leyenda-color azul"></span> Migración +
          </span>
          <span className="leyenda-item">
            <span className="leyenda-color naranja"></span> Migración -
          </span>
        </div>
      </div>
    );
  };

  // Renderizado de diente individual
  const renderDiente = useCallback((numero) => {
    const diente = dientes[numero] || getInitialDienteState();
    const ausente = dientesAusentes.has(numero);
    const esFurca = DIENTES_FURCA.includes(numero);

    return (
      <div 
        key={numero} 
        className={`diente ${ausente ? 'ausente' : ''}`}
        data-diente={numero}
        onClick={() => !ausente && handleDienteClick(numero)}
      >
        <div className="diente-numero">{numero}</div>
        {!ausente && (
          <>
            <div className="diente-pronostico">
              <div className="campo-container">
                <span className="campo-label">Pronóstico Individual</span>
                <select 
                  value={diente.pronostico} 
                  onChange={(e) => handlePronosticoChange(numero, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="campo-select"
                >
                  <option value="">-</option>
                  <option value="D">D</option>
                  <option value="F">F</option>
                  <option value="R">R</option>
                </select>
              </div>
            </div>
            
            <div className="diente-condicion">
              <div className="campo-container">
                <span className="campo-label">Condición Mucogingival</span>
                <select 
                  value={diente.condicionMucogingival} 
                  onChange={(e) => handleCondicionMucogingivalChange(numero, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="campo-select"
                >
                  <option value="">-</option>
                  <option value="R">R - Recesión gingival/Mucosa</option>
                  <option value="FA">FA - Frenillo/brida aberrante</option>
                  <option value="V">V - Vestíbulo poco profundo</option>
                  <option value="F">F - Fenestración</option>
                  <option value="O">O - Otra</option>
                </select>
              </div>
            </div>

            <div className="diente-movilidad">
              <div className="campo-container">
                <span className="campo-label">Movilidad</span>
                <select 
                  value={diente.movilidad} 
                  onChange={(e) => handleMovilidadChange(numero, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="campo-select"
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
            </div>

            {esFurca && (
              <div className="diente-furca">
                <div className="campo-container">
                  <span className="campo-label">Furca</span>
                  <select 
                    value={diente.lesionFurca} 
                    onChange={(e) => handleLesionFurcaChange(numero, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="campo-select"
                    style={{ backgroundColor: '#fff' }}
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
              </div>
            )}

            <div className="diente-sangrado">
              <div className="campo-container">
                <span className="campo-label">Sangrado</span>
                <button 
                  className="sangrado-button"
                  style={{ 
                    backgroundColor: getColorSangrado(diente.sangradoGeneral) === 'transparent' ? '#fff' : getColorSangrado(diente.sangradoGeneral),
                    border: '1px solid #ddd',
                    borderRadius: '3px',
                    width: '30px',
                    height: '25px',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    color: diente.sangradoGeneral ? 'white' : '#333'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSangradoGeneralClick(numero);
                  }}
                >
                  S
                </button>
              </div>
            </div>

            {/* Profundidad de Sondaje */}
            <div className="diente-profundidad">
              <div className="campo-container">
                <span className="campo-label">Profundidad de Sondaje</span>
                <div className="combo-boxes-container">
                  {vistaActual === 'vestibular' 
                    ? ['mesial', 'vestibular', 'distal'].map((sector) => (
                        <select
                          key={sector}
                          value={diente.profundidadSondaje.vestibular[sector] || ''}
                          onChange={(e) => handleProfundidadSondajeChange(numero, sector, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="combo-box"
                        >
                          <option value="">-</option>
                          {[...Array(12)].map((_, i) => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                      ))
                    : ['mesial', 'palatino', 'distal'].map((sector) => (
                        <select
                          key={sector}
                          value={diente.profundidadSondaje.palatina[sector] || ''}
                          onChange={(e) => handleProfundidadSondajeChange(numero, sector, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="combo-box"
                        >
                          <option value="">-</option>
                          {[...Array(12)].map((_, i) => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                      ))
                  }
                </div>
              </div>
            </div>

            {/* Migración Gingival */}
            <div className="diente-migracion">
              <div className="campo-container">
                <span className="campo-label">Migración Gingival</span>
                <div className="combo-boxes-container">
                  {vistaActual === 'vestibular'
                    ? ['mesial', 'vestibular', 'distal'].map((sector) => (
                        <select
                          key={sector}
                          value={diente.migracionGingival.vestibular[sector] || ''}
                          onChange={(e) => handleMigracionGingivalChange(numero, sector, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="combo-box"
                        >
                          <option value="">-</option>
                          {[...Array(25)].map((_, i) => (
                            <option key={i-12} value={i-12}>{i-12}</option>
                          ))}
                        </select>
                      ))
                    : ['mesial', 'palatino', 'distal'].map((sector) => (
                        <select
                          key={sector}
                          value={diente.migracionGingival.palatina[sector] || ''}
                          onChange={(e) => handleMigracionGingivalChange(numero, sector, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="combo-box"
                        >
                          <option value="">-</option>
                          {[...Array(25)].map((_, i) => (
                            <option key={i-12} value={i-12}>{i-12}</option>
                          ))}
                        </select>
                      ))
                  }
                </div>
              </div>
            </div>

            {/* Rectángulo con rayitas */}
            <RayitasRectangulo 
              profundidadSondaje={diente.profundidadSondaje}
              migracionGingival={diente.migracionGingival}
              vistaActual={vistaActual}
              numeroDiente={numero}
            />

            {/* Nota */}
            <div className="diente-nota">
              <div className="campo-container">
                <span className="campo-label">Nota</span>
                <textarea
                  value={diente.nota || ''}
                  onChange={(e) => handleNotaChange(numero, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="nota-textarea"
                  placeholder="Escribir nota..."
                />
              </div>
              <div className="campo-container">
                <span className="campo-label">Tipo</span>
                <select
                  value={diente.tipoNota || ''}
                  onChange={(e) => handleTipoNotaChange(numero, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="campo-select"
                >
                  <option value="">-</option>
                  <option value="RDF">RDF - Rehabilitación difícil sondaje</option>
                  <option value="SSR">SSR - Sondaje sin rehabilitación</option>
                  <option value="RF">RF - Raíces fusionadas</option>
                </select>
              </div>
            </div>
          </>
        )}
        
        {ausente && (
          <div className="diente-ausente-label">
            <span>Diente Ausente</span>
          </div>
        )}
        <button 
          className="btn-ausente"
          onClick={(e) => {
            e.stopPropagation();
            handleDienteAusente(numero);
          }}
        >
          {ausente ? 'Presente' : 'Ausente'}
        </button>
      </div>
    );
  }, [dientes, dientesAusentes, handleDienteClick, handlePronosticoChange, handleCondicionMucogingivalChange, 
       handleMovilidadChange, handleLesionFurcaChange, handleSangradoGeneralClick, handleProfundidadSondajeChange, handleMigracionGingivalChange, 
       handleDienteAusente, handleNotaChange, handleTipoNotaChange, getColorProfundidad, vistaActual]);

  if (loading && !paciente) return <p>Cargando...</p>;
  if (error) return <div className="error-message">{error}</div>;
  if (!paciente) return <p>No se encontró el paciente</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 w-full px-4">
        <div className="relative px-4 py-10 bg-white mx-0 shadow rounded-3xl sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <MessageDisplay message={displayMessage} type={messageType} onDismiss={handleDismissMessage} />
            
            {notification.show && (
              <div className={`notification ${notification.type === 'success' ? 'success' : 'error'}`}>
                {notification.message}
              </div>
            )}

            <div className="periodontograma-header">
              <h2 className="periodontograma-title">Periodontograma</h2>
              <div className="paciente-info">
                <p><strong>Paciente:</strong> {paciente.name} {paciente.lastname}</p>
                <p><strong>Cédula:</strong> {paciente.ci}</p>
              </div>
              
              {/* Botón de cambio de vista */}
              <div className="vista-toggle-container">
                <button
                  type="button"
                  className={`vista-toggle-btn ${vistaActual === 'vestibular' ? 'active' : ''}`}
                  onClick={() => setVistaActual('vestibular')}
                >
                  Vista Vestibular
                </button>
                <button
                  type="button"
                  className={`vista-toggle-btn ${vistaActual === 'palatina' ? 'active' : ''}`}
                  onClick={() => setVistaActual('palatina')}
                >
                  Vista Palatina
                </button>
              </div>
              
              {/* Selector de cuadrantes */}
              <div className="cuadrante-selector-container">
                <label className="cuadrante-label">Cuadrante:</label>
                <select
                  value={cuadranteSeleccionado}
                  onChange={(e) => setCuadranteSeleccionado(e.target.value)}
                  className="cuadrante-select"
                >
                  {Object.entries(cuadrantes).map(([key, cuadrante]) => (
                    <option key={key} value={key}>
                      {cuadrante.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="periodontograma-legend">
              <div className="legend-item">
                <div className="legend-color verde"></div>
                <span>Profundidad 1-3mm</span>
              </div>
              <div className="legend-item">
                <div className="legend-color rojo"></div>
                <span>Profundidad 4+mm</span>
              </div>
              <div className="legend-item">
                <div className="legend-color amarillo"></div>
                <span>Sangrado</span>
              </div>
            </div>

            <div className="periodontograma-dientes">
              {cuadranteSeleccionado === 'todos' ? (
                // Mostrar todos los dientes
                <>
                  <div className="dientes-superiores">
                    <h3>Dientes Superiores</h3>
                    <div className="dientes-grid">
                      {DIENTES_SUPERIORES.map(renderDiente)}
                    </div>
                  </div>

                  <div className="dientes-inferiores">
                    <h3>Dientes Inferiores</h3>
                    <div className="dientes-grid">
                      {DIENTES_INFERIORES.map(renderDiente)}
                    </div>
                  </div>
                </>
              ) : (
                // Mostrar solo el cuadrante seleccionado
                <div className="dientes-cuadrante">
                  <h3>{cuadrantes[cuadranteSeleccionado].nombre}</h3>
                  <div className="dientes-grid">
                    {cuadrantes[cuadranteSeleccionado].dientes.map(renderDiente)}
                  </div>
                </div>
              )}
            </div>

            <div className="periodontograma-observaciones">
              <label htmlFor="observaciones">Observaciones:</label>
              <textarea
                id="observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows="4"
                placeholder="Observaciones adicionales..."
              ></textarea>
            </div>

            <div className="periodontograma-actions">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="periodontograma-button periodontograma-button-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="periodontograma-button periodontograma-button-primary"
              >
                {loading ? 'Guardando...' : 'Guardar Periodontograma'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showConfirmModal && (
        <div className="modal-confirm">
          <div className="modal-confirm-content">
            <h3 className="modal-confirm-title">Confirmar salida</h3>
            <p className="modal-confirm-message">
              ¿Estás seguro que deseas salir? Los cambios no guardados se perderán.
            </p>
            <div className="modal-confirm-actions">
              <button
                className="periodontograma-button periodontograma-button-secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancelar
              </button>
              <button
                className="periodontograma-button periodontograma-button-primary"
                onClick={confirmCancel}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {fechaUltimaActualizacion && (
        <div className="fecha-periodontograma">
          Última actualización: {new Date(fechaUltimaActualizacion).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default Periodontograma; 