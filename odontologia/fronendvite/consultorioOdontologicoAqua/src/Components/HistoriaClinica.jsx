import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import MessageDisplay from './MessageDisplay';
import './styles/HistoriaClinica.css';

// Constantes para valores repetidos
const INITIAL_ENFERMEDADES = {
  cardiovasculares: false,
  diabetes: false,
  ets: false,
  otros: false,
};

const INITIAL_APRECIACION = {
  lucido: false,
  apiretico: false,
  colaborador: false,
  ambulatorio: false,
};

const INITIAL_EXAMEN_REGIONAL = {
  facies: false,
  cuello: false,
  ganglios: false,
  atm: false,
  macizoFacial: false,
  mandibula: false,
  musculos: false,
  meso: false,
  dolico: false,
  braqui: false,
};

const INITIAL_CONTINENTE = {
  esfinterOralAnterior: false,
  mejillas: false,
  paladar: false,
  pisoDeBoca: false,
  esfinterOralPosterior: false,
};

const INITIAL_CONTENIDO = {
  lenguaDorso: false,
  lenguaVientre: false,
  lenguaBordes: false,
  lenguaFrenillo: false,
  saliva: false,
  rebordesResiduales: false,
  bridasyFrenillos: false,
};

// Hook personalizado para manejar estados booleanos
const useBooleanState = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue(prev => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  return [value, setValue, toggle, setTrue, setFalse];
};

// Hook personalizado para manejar objetos de estado
const useObjectState = (initialState) => {
  const [state, setState] = useState(initialState);
  
  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);
  
  const resetState = useCallback(() => {
    setState(initialState);
  }, [initialState]);
  
  return [state, setState, updateState, resetState];
};

// Hook personalizado para manejar formularios
const useFormData = (initialData) => {
  const [formData, setFormData] = useState(initialData);
  
  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);
  
  const updateMultipleFields = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);
  
  const resetForm = useCallback(() => {
    setFormData(initialData);
  }, [initialData]);
  
  return [formData, setFormData, updateField, updateMultipleFields, resetForm];
};

const HistoriaClinica = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estados principales
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paciente, setPaciente] = useState(null);
  const [historiaClinicaId, setHistoriaClinicaId] = useState(null);
  const [fechaUltimaActualizacion, setFechaUltimaActualizacion] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Estados de notificación
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [displayMessage, setDisplayMessage] = useState(null);
  const [messageType, setMessageType] = useState('info');
  
  // Estados booleanos usando hook personalizado
  const [consumeDrogas, setConsumeDrogas] = useBooleanState();
  const [consumeBebidas, setConsumeBebidas] = useBooleanState();
  const [higieneProtesica, setHigieneProtesica] = useBooleanState();
  const [usaHiloDental, setUsaHiloDental] = useBooleanState();
  const [alergias, setAlergias] = useBooleanState();
  const [tomaMedicamentos, setTomaMedicamentos] = useBooleanState();
  const [consumeTe, setConsumeTe] = useBooleanState();
  const [consumeCafe, setConsumeCafe] = useBooleanState();
  const [consumeMate, setConsumeMate] = useBooleanState();
  const [noTomaMedicamentos, setNoTomaMedicamentos] = useBooleanState();
  const [tieneEnfermedades, setTieneEnfermedades] = useBooleanState();
  const [noTieneEnfermedades, setNoTieneEnfermedades] = useBooleanState();
  const [enTratamiento, setEnTratamiento] = useBooleanState();
  const [tomaBifosfonatos, setTomaBifosfonatos] = useBooleanState();
  const [dietaCariogenica, setDietaCariogenica] = useBooleanState();
  const [continenteAlteraciones, setContinenteAlteraciones] = useBooleanState();
  const [contenidoAlteraciones, setContenidoAlteraciones] = useBooleanState();
  const [fumador, setFumador] = useBooleanState();
  const [consumeAlcohol, setConsumeAlcohol] = useBooleanState();
  
  // Estados de objetos usando hook personalizado
  const [enfermedadesSeleccionadas, setEnfermedadesSeleccionadas, updateEnfermedades, resetEnfermedades] = useObjectState(INITIAL_ENFERMEDADES);
  const [apreciacionGeneral, setApreciacionGeneral, updateApreciacion, resetApreciacion] = useObjectState(INITIAL_APRECIACION);
  const [examenRegional, setExamenRegional, updateExamenRegional, resetExamenRegional] = useObjectState(INITIAL_EXAMEN_REGIONAL);
  const [continenteOpciones, setContinenteOpciones, updateContinente, resetContinente] = useObjectState(INITIAL_CONTINENTE);
  const [contenidoOpciones, setContenidoOpciones, updateContenido, resetContenido] = useObjectState(INITIAL_CONTENIDO);
  
  // Estados de detalles
  const [otrasEnfermedadesDetalle, setOtrasEnfermedadesDetalle] = useState('');
  const [examenRegionalDetalles, setExamenRegionalDetalles] = useState({});
  const [continenteDetalles, setContinenteDetalles] = useState({});
  const [contenidoDetalles, setContenidoDetalles] = useState({});
  
  // Formulario usando hook personalizado
  const [formData, setFormData, updateField, updateMultipleFields, resetForm] = useFormData({
    motivoConsulta: '',
    cepilladoDental: '',
    cepilladoEncias: '',
    cepilladoLingual: '',
    observacionesHigienicas: '',
    enfermedadesActuales: '',
    medicamentos: '',
    alergiasDetalle: '',
    posologia: '',
    antecedentesFamiliares: '',
    apreciacionGeneral: '',
    apreciacionGeneralDetalle: '',
    examenRegional: '',
    examenRegionalDetalle: '',
    examenLocal: '',
    examenLocalDetalle: ''
  });

  useEffect(() => {
    if (location.state?.paciente) {
      setPaciente(location.state.paciente);
      setLoading(false);
      fetchHistoriaClinica(location.state.paciente.id);
    } else {
      fetchPaciente();
    }
  }, [id, location.state]);

  const fetchPaciente = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/pacientes/${id}`);
      setPaciente(response.data);
      fetchHistoriaClinica(response.data.id);
    } catch (error) {
      console.error('Error al cargar paciente:', error);
      setError('Error al cargar los datos del paciente');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoriaClinica = async (pacienteId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/historia-clinica/paciente/${pacienteId}`);
      if (response.data) {
        setHistoriaClinicaId(response.data.id);
        setFechaUltimaActualizacion(response.data.fechaActualizacion || response.data.fechaCreacion);
        loadHistoriaClinicaData(response.data);
      }
    } catch (error) {
      // Si no hay historia clínica, no hacer nada
    }
  };

 const loadHistoriaClinicaData = (data) => {
  // Cargar campos de texto y numéricos
  updateMultipleFields({
    motivoConsulta: data.motivoConsulta || '',
    cepilladoDental: data.cepilladoDental || '',
    cepilladoEncias: data.cepilladoEncias || '',
    cepilladoLingual: data.cepilladoLingual || '',
    observacionesHigienicas: data.observacionesHigienicas || '',
    enfermedadesActuales: data.enfermedadesActuales || '',
    medicamentos: data.medicamentos || '',
    alergiasDetalle: data.alergias || '',
    posologia: data.posologia || '',
    antecedentesFamiliares: data.antecedentesFamiliares || '',
    apreciacionGeneral: data.apreciacionGeneral || '',
    apreciacionGeneralDetalle: data.apreciacionGeneralDetalle || '',
    examenRegional: data.examenRegional || '',
    examenRegionalDetalle: data.examenRegionalDetalle || '',
    examenLocal: data.examenLocal || '',
    examenLocalDetalle: data.examenLocalDetalle || ''
  });

  // Cargar checkboxes y booleanos (asegúrate de usar Boolean para convertir 0/1 a true/false)
  setUsaHiloDental(Boolean(data.usaHiloDental));
  setHigieneProtesica(Boolean(data.higieneProtesica));
  setFumador(Boolean(data.fumador));
  setConsumeCafe(Boolean(data.consumeCafe));
  setConsumeTe(Boolean(data.consumeTe));
  setConsumeMate(Boolean(data.consumeMate));
  setConsumeAlcohol(Boolean(data.consumeAlcohol));
  setConsumeDrogas(Boolean(data.consumeDrogas));
  setEnTratamiento(Boolean(data.enTratamiento));
  setTomaBifosfonatos(Boolean(data.tomaBifosfonatos));

  // Enfermedades
  if (data.enfermedadesActuales) {
    setTieneEnfermedades(true);
    setNoTieneEnfermedades(false);

    const enfermedades = data.enfermedadesActuales.toLowerCase();
    const nuevasEnfermedades = { ...INITIAL_ENFERMEDADES };

    if (enfermedades.includes('cardiovasculares')) nuevasEnfermedades.cardiovasculares = true;
    if (enfermedades.includes('diabetes')) nuevasEnfermedades.diabetes = true;
    if (enfermedades.includes('ets')) nuevasEnfermedades.ets = true;
    if (enfermedades.includes('otros:')) {
      nuevasEnfermedades.otros = true;
      const otrosMatch = data.enfermedadesActuales.match(/otros:\s*(.+)/i);
      if (otrosMatch) {
        setOtrasEnfermedadesDetalle(otrosMatch[1].trim());
      }
    }
    setEnfermedadesSeleccionadas(nuevasEnfermedades);
  } else {
    setTieneEnfermedades(false);
    setNoTieneEnfermedades(true);
  }

  // Medicamentos
  if (data.medicamentos) {
    setTomaMedicamentos(true);
    setNoTomaMedicamentos(false);
  } else {
    setTomaMedicamentos(false);
    setNoTomaMedicamentos(true);
  }

  // Alergias
  setAlergias(Boolean(data.alergias));

  // Apreciación general (checkboxes)
  if (data.apreciacionGeneral) {
    const apreciaciones = data.apreciacionGeneral.toLowerCase();
    const nuevasApreciaciones = { ...INITIAL_APRECIACION };
    if (apreciaciones.includes('lúcido')) nuevasApreciaciones.lucido = true;
    if (apreciaciones.includes('apirético')) nuevasApreciaciones.apiretico = true;
    if (apreciaciones.includes('colaborador')) nuevasApreciaciones.colaborador = true;
    if (apreciaciones.includes('ambulatorio')) nuevasApreciaciones.ambulatorio = true;
    setApreciacionGeneral(nuevasApreciaciones);
  }

  // Examen regional (checkboxes)
  if (data.examenRegional) {
    const examenes = data.examenRegional.toLowerCase();
    const nuevosExamenes = { ...INITIAL_EXAMEN_REGIONAL };
    if (examenes.includes('facies')) nuevosExamenes.facies = true;
    if (examenes.includes('cuello')) nuevosExamenes.cuello = true;
    if (examenes.includes('ganglios')) nuevosExamenes.ganglios = true;
    if (examenes.includes('atm')) nuevosExamenes.atm = true;
    if (examenes.includes('macizo facial')) nuevosExamenes.macizoFacial = true;
    if (examenes.includes('mandíbula')) nuevosExamenes.mandibula = true;
    if (examenes.includes('músculos')) nuevosExamenes.musculos = true;
    if (examenes.includes('meso')) nuevosExamenes.meso = true;
    if (examenes.includes('dólico')) nuevosExamenes.dolico = true;
    if (examenes.includes('braqui')) nuevosExamenes.braqui = true;
    setExamenRegional(nuevosExamenes);
  }

  // Examen local (continente)
  if (data.examenLocal && data.examenLocal.includes('continente alterado:')) {
    setContinenteAlteraciones(true);
    const continente = data.examenLocal.toLowerCase();
    const nuevosContinente = { ...INITIAL_CONTINENTE };
    if (continente.includes('esfínter oral anterior')) nuevosContinente.esfinterOralAnterior = true;
    if (continente.includes('mejillas')) nuevosContinente.mejillas = true;
    if (continente.includes('paladar')) nuevosContinente.paladar = true;
    if (continente.includes('piso de boca')) nuevosContinente.pisoDeBoca = true;
    if (continente.includes('esfínter oral posterior')) nuevosContinente.esfinterOralPosterior = true;
    setContinenteOpciones(nuevosContinente);
  }

  // Parsear detalles JSON si existen
  try {
    if (data.examenRegionalDetalles) {
      const detalles = typeof data.examenRegionalDetalles === 'string'
        ? JSON.parse(data.examenRegionalDetalles)
        : data.examenRegionalDetalles;
      setExamenRegionalDetalles(detalles);
    }
  } catch (error) {
    console.warn('Error parsing examenRegionalDetalles:', error);
  }

  try {
    if (data.continenteDetalles) {
      const detalles = typeof data.continenteDetalles === 'string'
        ? JSON.parse(data.continenteDetalles)
        : data.continenteDetalles;
      setContinenteDetalles(detalles);
    }
  } catch (error) {
    console.warn('Error parsing continenteDetalles:', error);
  }
};

  // Manejadores optimizados
  const handleCheckboxChange = useCallback((setter) => (event) => {
    setter(event.target.checked);
  }, []);

  const handleMedicacionChange = useCallback((field) => (event) => {
    if (field === 'tomaMedicamentos') {
      setTomaMedicamentos(event.target.checked);
      if (event.target.checked) setNoTomaMedicamentos(false);
    } else if (field === 'noTomaMedicamentos') {
      setNoTomaMedicamentos(event.target.checked);
      if (event.target.checked) setTomaMedicamentos(false);
    }
  }, [setTomaMedicamentos, setNoTomaMedicamentos]);

  const handleTieneEnfermedadesChange = useCallback((field) => (event) => {
    if (field === 'tieneEnfermedades') {
      setTieneEnfermedades(event.target.checked);
      if (event.target.checked) {
        setNoTieneEnfermedades(false);
      } else {
        resetEnfermedades();
        setOtrasEnfermedadesDetalle('');
        setEnTratamiento(false);
      }
    } else if (field === 'noTieneEnfermedades') {
      setNoTieneEnfermedades(event.target.checked);
      if (event.target.checked) {
        setTieneEnfermedades(false);
        resetEnfermedades();
        setOtrasEnfermedadesDetalle('');
        setEnTratamiento(false);
      }
    }
  }, [setTieneEnfermedades, setNoTieneEnfermedades, resetEnfermedades, setEnTratamiento]);

  const handleEnfermedadSelection = useCallback((event) => {
    updateEnfermedades({ [event.target.name]: event.target.checked });
  }, [updateEnfermedades]);

  const handleApreciacionGeneralChange = useCallback((event) => {
    updateApreciacion({ [event.target.name]: event.target.checked });
  }, [updateApreciacion]);

  const handleExamenRegionalChange = useCallback((event) => {
    const { name, checked } = event.target;
    updateExamenRegional({ [name]: checked });
    if (!checked && examenRegionalDetalles[name] !== undefined) {
      setExamenRegionalDetalles(prev => ({ ...prev, [name]: '' }));
    }
  }, [updateExamenRegional, examenRegionalDetalles]);

  const handleExamenRegionalDetalleChange = useCallback((event) => {
    setExamenRegionalDetalles(prev => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleContinenteAlteracionesChange = useCallback((event) => {
    const { checked } = event.target;
    setContinenteAlteraciones(checked);
    if (!checked) {
      resetContinente();
      setContinenteDetalles({});
    }
  }, [setContinenteAlteraciones, resetContinente]);

  const handleContinenteOpcionesChange = useCallback((event) => {
    const { name, checked } = event.target;
    updateContinente({ [name]: checked });
    if (!checked) {
      setContinenteDetalles(prev => ({ ...prev, [name]: '' }));
    }
  }, [updateContinente]);

  const handleContinenteDetalleChange = useCallback((event) => {
    setContinenteDetalles(prev => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleContenidoAlteracionesChange = useCallback((event) => {
    const { checked } = event.target;
    setContenidoAlteraciones(checked);
    if (!checked) {
      resetContenido();
      setContenidoDetalles({});
    }
  }, [setContenidoAlteraciones, resetContenido]);

  const handleContenidoOpcionesChange = useCallback((event) => {
    const { name, checked } = event.target;
    updateContenido({ [name]: checked });
    if (!checked) {
      setContenidoDetalles(prev => ({ ...prev, [name]: '' }));
    }
  }, [updateContenido]);

  const handleContenidoDetalleChange = useCallback((event) => {
    setContenidoDetalles(prev => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleInputChange = useCallback((field, value) => {
    updateField(field, value);
  }, [updateField]);

  // Utilidades
  const showNotification = useCallback((type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  }, []);

  const buildEnfermedadesActuales = useCallback(() => {
    if (!tieneEnfermedades) return '';
    
    const enfermedades = [];
    if (enfermedadesSeleccionadas.cardiovasculares) enfermedades.push('Cardiovasculares');
    if (enfermedadesSeleccionadas.diabetes) enfermedades.push('Diabetes');
    if (enfermedadesSeleccionadas.ets) enfermedades.push('ETS');
    if (enfermedadesSeleccionadas.otros && otrasEnfermedadesDetalle) {
      enfermedades.push(`Otros: ${otrasEnfermedadesDetalle}`);
    }
    return enfermedades.join(', ');
  }, [tieneEnfermedades, enfermedadesSeleccionadas, otrasEnfermedadesDetalle]);

  const buildMedicamentos = useCallback(() => {
    return tomaMedicamentos ? (formData.medicamentos || 'Medicamentos especificados') : '';
  }, [tomaMedicamentos, formData.medicamentos]);

  const buildAlergias = useCallback(() => {
    return alergias ? (formData.alergiasDetalle || 'Alergias especificadas') : '';
  }, [alergias, formData.alergiasDetalle]);

  const buildApreciacionGeneral = useCallback(() => {
    const apreciaciones = [];
    if (apreciacionGeneral.lucido) apreciaciones.push('Lúcido');
    if (apreciacionGeneral.apiretico) apreciaciones.push('Apirético');
    if (apreciacionGeneral.colaborador) apreciaciones.push('Colaborador');
    if (apreciacionGeneral.ambulatorio) apreciaciones.push('Ambulatorio');
    return apreciaciones.join(', ');
  }, [apreciacionGeneral]);

  const buildExamenRegional = useCallback(() => {
    const examenesRegionales = [];
    if (examenRegional.facies) examenesRegionales.push('Facies');
    if (examenRegional.cuello) examenesRegionales.push('Cuello');
    if (examenRegional.ganglios) examenesRegionales.push('Ganglios');
    if (examenRegional.atm) examenesRegionales.push('ATM');
    if (examenRegional.macizoFacial) examenesRegionales.push('Macizo facial');
    if (examenRegional.mandibula) examenesRegionales.push('Mandíbula');
    if (examenRegional.musculos) examenesRegionales.push('Músculos');
    if (examenRegional.meso) examenesRegionales.push('Meso');
    if (examenRegional.dolico) examenesRegionales.push('Dólico');
    if (examenRegional.braqui) examenesRegionales.push('Braqui');
    return examenesRegionales.join(', ');
  }, [examenRegional]);

  const buildExamenLocal = useCallback(() => {
    if (!continenteAlteraciones) return '';
    
    const continenteItems = [];
    if (continenteOpciones.esfinterOralAnterior) continenteItems.push('Esfínter oral anterior');
    if (continenteOpciones.mejillas) continenteItems.push('Mejillas');
    if (continenteOpciones.paladar) continenteItems.push('Paladar');
    if (continenteOpciones.pisoDeBoca) continenteItems.push('Piso de boca');
    if (continenteOpciones.esfinterOralPosterior) continenteItems.push('Esfínter oral posterior');
    return `Continente alterado: ${continenteItems.join(', ')}`;
  }, [continenteAlteraciones, continenteOpciones]);

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

    const historiaClinicaData = {
      paciente: { id: paciente.id },
      motivoConsulta: formData.motivoConsulta,
      cepilladoDental: formData.cepilladoDental,
      cepilladoEncias: formData.cepilladoEncias,
      cepilladoLingual: formData.cepilladoLingual,
      observacionesHigienicas: formData.observacionesHigienicas,
      usaHiloDental: usaHiloDental,
      higieneProtesica: higieneProtesica,
      enfermedadesActuales: buildEnfermedadesActuales(),
      medicamentos: buildMedicamentos(),
      alergias: buildAlergias(),
      posologia: formData.posologia,
      antecedentesFamiliares: formData.antecedentesFamiliares,
      enTratamiento: enTratamiento,
      tomaBifosfonatos: tomaBifosfonatos,
      apreciacionGeneral: buildApreciacionGeneral(),
      apreciacionGeneralDetalle: formData.apreciacionGeneralDetalle,
      examenRegional: buildExamenRegional(),
      examenRegionalDetalle: formData.examenRegionalDetalle,
      examenLocal: buildExamenLocal(),
      examenLocalDetalle: formData.examenLocalDetalle,
      examenRegionalDetalles: examenRegionalDetalles,
      continenteDetalles: continenteDetalles,
      fumador: fumador,
      consumeCafe: consumeCafe,
      consumeTe: consumeTe,
      consumeMate: consumeMate,
      consumeAlcohol: consumeAlcohol,
      consumeDrogas: consumeDrogas,
      usuario: { id: 1 }
    };

    try {
      let response;
      if (historiaClinicaId) {
        response = await axios.put(`http://localhost:8080/api/historia-clinica/${historiaClinicaId}`, historiaClinicaData);
      } else {
        response = await axios.post('http://localhost:8080/api/historia-clinica', historiaClinicaData);
      }
      
      showNotification('success', '¡Historia clínica guardada con éxito!');
      if (response.data.fechaActualizacion) {
        setFechaUltimaActualizacion(response.data.fechaActualizacion);
      } else if (response.data.fechaCreacion) {
        setFechaUltimaActualizacion(response.data.fechaCreacion);
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      const errorMessage = error.response?.data?.message || 'Error al guardar la historia clínica';
      showNotification('error', `Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [
    paciente, formData, usaHiloDental, higieneProtesica, enTratamiento, tomaBifosfonatos,
    fumador, consumeCafe, consumeTe, consumeMate, consumeAlcohol, consumeDrogas,
    examenRegionalDetalles, continenteDetalles, historiaClinicaId,
    buildEnfermedadesActuales, buildMedicamentos, buildAlergias, buildApreciacionGeneral,
    buildExamenRegional, buildExamenLocal, showNotification
  ]);

  const handleDismissMessage = useCallback(() => {
    setDisplayMessage(null);
    setMessageType('info');
  }, []);

  if (loading && !paciente) return <p>Cargando...</p>;
  if (error) return <div className="error-message">{error}</div>;
  if (!paciente) return <p>No se encontró el paciente</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <MessageDisplay message={displayMessage} type={messageType} onDismiss={handleDismissMessage} />
            
            {notification.show && (
              <div className={`notification ${notification.type === 'success' ? 'success' : 'error'}`}>
                {notification.message}
              </div>
            )}

            <div className="historia-clinica-container">
              <div className="historia-clinica-card">
                <div className="historia-clinica-header">
                  <h2 className="historia-clinica-title">Historia Clínica</h2>
                </div>

                <div className="historia-clinica-section">
                  <h3 className="historia-clinica-section-title">Información Personal y Contacto</h3>
                  <div className="historia-clinica-grid">
                    <div className="historia-clinica-item">
                      <label>Nombre:</label>
                      <span>{paciente.name} {paciente.lastname}</span>
                    </div>
                    <div className="historia-clinica-item">
                      <label>Cédula:</label>
                      <span>{paciente.ci}</span>
                    </div>
                    <div className="historia-clinica-item">
                      <label>Sexo:</label>
                      <span>{paciente.gender}</span>
                    </div>
                    <div className="historia-clinica-item">
                      <label>Teléfono:</label>
                      <span>{paciente.telephone}</span>
                    </div>
                    <div className="historia-clinica-item full-width">
                      <label htmlFor="motivoConsulta">Motivo de consulta:</label>
                      <textarea
                        id="motivoConsulta"
                        name="motivoConsulta"
                        value={formData.motivoConsulta}
                        onChange={(e) => handleInputChange('motivoConsulta', e.target.value)}
                        rows="3"
                        placeholder="Describa el motivo de la consulta"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="historia-clinica-section">
                  <h3 className="historia-clinica-section-title">Hábitos</h3>
                  <div className="habitos-higiene-section">
                    <div className="habitos-higiene-column">
                      <h4>De higiene:</h4>
                      <div className="habitos-higiene-input-group">
                        <div className="habitos-higiene-input-container">
                          <label htmlFor="cepilladoDental">Cepillado dental: (Indicar valor diario)</label>
                          <input
                            type="number"
                            id="cepilladoDental"
                            name="cepilladoDental"
                            value={formData.cepilladoDental}
                            onChange={(e) => handleInputChange('cepilladoDental', e.target.value)}
                            min="0"
                          />
                        </div>
                        <div className="habitos-higiene-input-container">
                          <label htmlFor="cepilladoEncias">Cepillado de encías: (Indicar valor diario)</label>
                          <input
                            type="number"
                            id="cepilladoEncias"
                            name="cepilladoEncias"
                            value={formData.cepilladoEncias}
                            onChange={(e) => handleInputChange('cepilladoEncias', e.target.value)}
                            min="0"
                          />
                        </div>
                        <div className="habitos-higiene-input-container">
                          <label htmlFor="cepilladoLingual">Cepillado lingual: (Indicar valor diario)</label>
                          <input
                            type="number"
                            id="cepilladoLingual"
                            name="cepilladoLingual"
                            value={formData.cepilladoLingual}
                            onChange={(e) => handleInputChange('cepilladoLingual', e.target.value)}
                            min="0"
                          />
                        </div>
                      </div>
                      <div className="habitos-higiene-checkbox-group">
                        <label className="habitos-higiene-checkbox-label">
                          <input
                            type="checkbox"
                            className="habitos-higiene-checkbox"
                            name="usaHiloDental"
                            checked={usaHiloDental}
                            onChange={handleCheckboxChange(setUsaHiloDental)}
                          />
                          Usa Hilo dental
                        </label>
                        <label className="habitos-higiene-checkbox-label">
                          <input
                            type="checkbox"
                            className="habitos-higiene-checkbox"
                            name="higieneProtesica"
                            checked={higieneProtesica}
                            onChange={handleCheckboxChange(setHigieneProtesica)}
                          />
                          Higiene protésica
                        </label>
                      </div>
                      <div className="habitos-higiene-checkbox-group" style={{marginTop: '1rem'}}>
                        <label className="habitos-higiene-checkbox-label">
                          <input
                            type="checkbox"
                            className="habitos-higiene-checkbox"
                            name="fumador"
                            checked={fumador}
                            onChange={handleCheckboxChange(setFumador)}
                          />
                          Fumador
                        </label>
                        <label className="habitos-higiene-checkbox-label">
                          <input
                            type="checkbox"
                            className="habitos-higiene-checkbox"
                            name="consumeCafe"
                            checked={consumeCafe}
                            onChange={handleCheckboxChange(setConsumeCafe)}
                          />
                          Consume café
                        </label>
                        <label className="habitos-higiene-checkbox-label">
                          <input
                            type="checkbox"
                            className="habitos-higiene-checkbox"
                            name="consumeTe"
                            checked={consumeTe}
                            onChange={handleCheckboxChange(setConsumeTe)}
                          />
                          Consume té
                        </label>
                        <label className="habitos-higiene-checkbox-label">
                          <input
                            type="checkbox"
                            className="habitos-higiene-checkbox"
                            name="consumeMate"
                            checked={consumeMate}
                            onChange={handleCheckboxChange(setConsumeMate)}
                          />
                          Consume mate
                        </label>
                        <label className="habitos-higiene-checkbox-label">
                          <input
                            type="checkbox"
                            className="habitos-higiene-checkbox"
                            name="consumeAlcohol"
                            checked={consumeAlcohol}
                            onChange={handleCheckboxChange(setConsumeAlcohol)}
                          />
                          Consume alcohol
                        </label>
                        <label className="habitos-higiene-checkbox-label">
                          <input
                            type="checkbox"
                            className="habitos-higiene-checkbox"
                            name="consumeDrogas"
                            checked={consumeDrogas}
                            onChange={handleCheckboxChange(setConsumeDrogas)}
                          />
                          Consume drogas
                        </label>
                      </div>
                    </div>
                    <div className="habitos-higiene-column">
                      <div className="habitos-higiene-observaciones">
                        <label htmlFor="observacionesHigienicas">Observaciones Higiénicas:</label>
                        <textarea
                          id="observacionesHigienicas"
                          name="observacionesHigienicas"
                          value={formData.observacionesHigienicas}
                          onChange={(e) => handleInputChange('observacionesHigienicas', e.target.value)}
                          placeholder="Campo para observaciones de higiene o cualquier dato adicional"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="historia-clinica-section">
                  <h3 className="historia-clinica-section-title">Antecedentes Médicos</h3>
                  <div className="enfermedades-section">
                    <div className="enfermedades-item">
                      <h4 className="enfermedades-title">¿Tiene enfermedades?</h4>
                      <div className="enfermedades-checkbox-group">
                        <label className="enfermedades-checkbox-label">
                          <input
                            type="checkbox"
                            className="enfermedades-checkbox"
                            name="tieneEnfermedades"
                            checked={tieneEnfermedades}
                            onChange={handleTieneEnfermedadesChange('tieneEnfermedades')}
                          />
                          Sí
                        </label>
                        <label className="enfermedades-checkbox-label">
                          <input
                            type="checkbox"
                            className="enfermedades-checkbox"
                            name="noTieneEnfermedades"
                            checked={noTieneEnfermedades}
                            onChange={handleTieneEnfermedadesChange('noTieneEnfermedades')}
                          />
                          No
                        </label>
                      </div>
                    </div>

                    {tieneEnfermedades && (
                      <>
                        <div className="enfermedades-item">
                          <h4 className="enfermedades-title">Lista de Enfermedades:</h4>
                          <div className="enfermedades-checkbox-group">
                            <label className="enfermedades-checkbox-label">
                              <input
                                type="checkbox"
                                className="enfermedades-checkbox"
                                name="cardiovasculares"
                                checked={enfermedadesSeleccionadas.cardiovasculares}
                                onChange={handleEnfermedadSelection}
                              />
                              Cardiovasculares
                            </label>
                            <label className="enfermedades-checkbox-label">
                              <input
                                type="checkbox"
                                className="enfermedades-checkbox"
                                name="diabetes"
                                checked={enfermedadesSeleccionadas.diabetes}
                                onChange={handleEnfermedadSelection}
                              />
                              Diabetes
                            </label>
                            <label className="enfermedades-checkbox-label">
                              <input
                                type="checkbox"
                                className="enfermedades-checkbox"
                                name="ets"
                                checked={enfermedadesSeleccionadas.ets}
                                onChange={handleEnfermedadSelection}
                              />
                              ETS
                            </label>
                            <label className="enfermedades-checkbox-label">
                              <input
                                type="checkbox"
                                className="enfermedades-checkbox"
                                name="otros"
                                checked={enfermedadesSeleccionadas.otros}
                                onChange={handleEnfermedadSelection}
                              />
                              Otros
                            </label>
                          </div>
                        </div>

                        {enfermedadesSeleccionadas.otros && (
                          <div className="enfermedades-item">
                            <label className="enfermedades-checkbox-label">Especificar Otras Enfermedades:</label>
                            <textarea
                              className="enfermedades-textarea"
                              name="otrasEnfermedadesDetalle"
                              placeholder="Especifique las otras enfermedades"
                              value={otrasEnfermedadesDetalle}
                              onChange={(e) => setOtrasEnfermedadesDetalle(e.target.value)}
                            ></textarea>
                          </div>
                        )}

                        <div className="enfermedades-item">
                          <label className="enfermedades-checkbox-label">
                            <input
                              type="checkbox"
                              className="enfermedades-checkbox"
                              name="enTratamiento"
                              checked={enTratamiento}
                              onChange={handleCheckboxChange(setEnTratamiento)}
                            />
                            Está en tratamiento
                          </label>
                        </div>
                      </>
                    )}

                    <div className="enfermedades-item">
                      <label className="enfermedades-checkbox-label">
                        <input
                          type="checkbox"
                          className="enfermedades-checkbox"
                          name="alergias"
                          checked={alergias}
                          onChange={handleCheckboxChange(setAlergias)}
                        />
                        Alergias
                      </label>
                    </div>

                    {alergias && (
                      <div className="enfermedades-item">
                        <label className="enfermedades-checkbox-label">Especificar Alergias:</label>
                        <textarea
                          className="enfermedades-textarea"
                          name="alergiasDetalle"
                          value={formData.alergiasDetalle}
                          onChange={(e) => handleInputChange('alergiasDetalle', e.target.value)}
                          placeholder="Detalle las alergias"
                        ></textarea>
                      </div>
                    )}

                    <div className="enfermedades-item">
                      <div className="enfermedades-checkbox-group">
                        <label className="enfermedades-checkbox-label">
                          <input
                            type="checkbox"
                            className="enfermedades-checkbox"
                            name="tomaMedicamentos"
                            checked={tomaMedicamentos}
                            onChange={handleMedicacionChange('tomaMedicamentos')}
                          />
                          Toma medicaciones
                        </label>
                        <label className="enfermedades-checkbox-label">
                          <input
                            type="checkbox"
                            className="enfermedades-checkbox"
                            name="noTomaMedicamentos"
                            checked={noTomaMedicamentos}
                            onChange={handleMedicacionChange('noTomaMedicamentos')}
                          />
                          No toma medicaciones
                        </label>
                      </div>
                    </div>

                    {tomaMedicamentos && (
                      <>
                        <div className="enfermedades-item">
                          <label className="enfermedades-checkbox-label">Medicamentos que toma:</label>
                          <textarea
                            className="enfermedades-textarea"
                            name="medicamentos"
                            value={formData.medicamentos}
                            onChange={(e) => handleInputChange('medicamentos', e.target.value)}
                            placeholder="Liste los medicamentos"
                          ></textarea>
                        </div>

                        <div className="enfermedades-item">
                          <label className="enfermedades-checkbox-label">Posología y Comentarios:</label>
                          <textarea
                            className="enfermedades-textarea"
                            name="posologia"
                            value={formData.posologia}
                            onChange={(e) => handleInputChange('posologia', e.target.value)}
                            placeholder="Detalle la posología y otros comentarios relevantes"
                          ></textarea>
                        </div>

                        <div className="enfermedades-item">
                          <label className="enfermedades-checkbox-label">
                            <input
                              type="checkbox"
                              className="enfermedades-checkbox"
                              name="tomaBifosfonatos"
                              checked={tomaBifosfonatos}
                              onChange={handleCheckboxChange(setTomaBifosfonatos)}
                            />
                            Toma Bifosfonatos
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="historia-clinica-section">
                  <h3 className="historia-clinica-section-title">Antecedentes Familiares</h3>
                  <div className="historia-clinica-grid">
                    <div className="historia-clinica-item full-width">
                      <label htmlFor="antecedentesFamiliares">Antecedentes Familiares:</label>
                      <textarea
                        id="antecedentesFamiliares"
                        name="antecedentesFamiliares"
                        value={formData.antecedentesFamiliares}
                        onChange={(e) => handleInputChange('antecedentesFamiliares', e.target.value)}
                        rows="3"
                        placeholder="Describa los antecedentes familiares relevantes"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="historia-clinica-section">
                  <h3 className="historia-clinica-section-title">Apreciación General</h3>
                  <div className="apreciacion-general-checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="lucido"
                        checked={apreciacionGeneral.lucido}
                        onChange={handleApreciacionGeneralChange}
                      />
                      Lúcido
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="apiretico"
                        checked={apreciacionGeneral.apiretico}
                        onChange={handleApreciacionGeneralChange}
                      />
                      Apirético
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="colaborador"
                        checked={apreciacionGeneral.colaborador}
                        onChange={handleApreciacionGeneralChange}
                      />
                      Colaborador
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="ambulatorio"
                        checked={apreciacionGeneral.ambulatorio}
                        onChange={handleApreciacionGeneralChange}
                      />
                      Ambulatorio
                    </label>
                  </div>
                  <textarea
                    name="apreciacionGeneralDetalle"
                    value={formData.apreciacionGeneralDetalle}
                    onChange={(e) => handleInputChange('apreciacionGeneralDetalle', e.target.value)}
                    placeholder="Detalle apreciación general"
                  ></textarea>
                </div>

                <div className="historia-clinica-section">
                  <h3 className="historia-clinica-section-title">Examen Regional</h3>
                  <div className="examen-items">
                    <div className="examen-item">
                      <label>
                        <input
                          type="checkbox"
                          name="facies"
                          checked={examenRegional.facies}
                          onChange={handleExamenRegionalChange}
                        />
                        Facies
                      </label>
                      {examenRegional.facies && (
                        <textarea
                          name="facies"
                          placeholder="Detalle aquí"
                          value={examenRegionalDetalles.facies}
                          onChange={handleExamenRegionalDetalleChange}
                        ></textarea>
                      )}
                    </div>

                    <div className="examen-item">
                      <label>
                        <input
                          type="checkbox"
                          name="cuello"
                          checked={examenRegional.cuello}
                          onChange={handleExamenRegionalChange}
                        />
                        Cuello
                      </label>
                      {examenRegional.cuello && (
                        <textarea
                          name="cuello"
                          placeholder="Detalle aquí"
                          value={examenRegionalDetalles.cuello}
                          onChange={handleExamenRegionalDetalleChange}
                        ></textarea>
                      )}
                    </div>

                    <div className="examen-item">
                      <label>
                        <input
                          type="checkbox"
                          name="ganglios"
                          checked={examenRegional.ganglios}
                          onChange={handleExamenRegionalChange}
                        />
                        Ganglios
                      </label>
                      {examenRegional.ganglios && (
                        <textarea
                          name="ganglios"
                          placeholder="Detalle aquí"
                          value={examenRegionalDetalles.ganglios}
                          onChange={handleExamenRegionalDetalleChange}
                        ></textarea>
                      )}
                    </div>

                    <div className="examen-item">
                      <label>
                        <input
                          type="checkbox"
                          name="atm"
                          checked={examenRegional.atm}
                          onChange={handleExamenRegionalChange}
                        />
                        ATM
                      </label>
                      {examenRegional.atm && (
                        <textarea
                          name="atm"
                          placeholder="Detalle aquí"
                          value={examenRegionalDetalles.atm}
                          onChange={handleExamenRegionalDetalleChange}
                        ></textarea>
                      )}
                    </div>

                    <div className="examen-item">
                      <label>
                        <input
                          type="checkbox"
                          name="macizoFacial"
                          checked={examenRegional.macizoFacial}
                          onChange={handleExamenRegionalChange}
                        />
                        Macizo facial
                      </label>
                      {examenRegional.macizoFacial && (
                        <textarea
                          name="macizoFacial"
                          placeholder="Detalle aquí"
                          value={examenRegionalDetalles.macizoFacial}
                          onChange={handleExamenRegionalDetalleChange}
                        ></textarea>
                      )}
                    </div>

                    <div className="examen-item">
                      <label>
                        <input
                          type="checkbox"
                          name="mandibula"
                          checked={examenRegional.mandibula}
                          onChange={handleExamenRegionalChange}
                        />
                        Mandíbula
                      </label>
                      {examenRegional.mandibula && (
                        <textarea
                          name="mandibula"
                          placeholder="Detalle aquí"
                          value={examenRegionalDetalles.mandibula}
                          onChange={handleExamenRegionalDetalleChange}
                        ></textarea>
                      )}
                    </div>

                    <div className="examen-item">
                      <label>
                        <input
                          type="checkbox"
                          name="musculos"
                          checked={examenRegional.musculos}
                          onChange={handleExamenRegionalChange}
                        />
                        Músculos
                      </label>
                      {examenRegional.musculos && (
                        <textarea
                          name="musculos"
                          placeholder="Detalle aquí"
                          value={examenRegionalDetalles.musculos}
                          onChange={handleExamenRegionalDetalleChange}
                        ></textarea>
                      )}
                    </div>

                    <div className="examen-item">
                      <label>
                        <input
                          type="checkbox"
                          name="meso"
                          checked={examenRegional.meso}
                          onChange={handleExamenRegionalChange}
                        />
                        Meso
                      </label>
                    </div>

                    <div className="examen-item">
                      <label>
                        <input
                          type="checkbox"
                          name="dolico"
                          checked={examenRegional.dolico}
                          onChange={handleExamenRegionalChange}
                        />
                        Dólico
                      </label>
                    </div>

                    <div className="examen-item">
                      <label>
                        <input
                          type="checkbox"
                          name="braqui"
                          checked={examenRegional.braqui}
                          onChange={handleExamenRegionalChange}
                        />
                        Braqui
                      </label>
                    </div>
                  </div>
                </div>

                <div className="historia-clinica-section">
                  <h3 className="historia-clinica-section-title">Examen Local</h3>
                  <div className="examen-local-columns">
                    {/* CONTINENTE */}
                    <div className="examen-local-column">
                      <div className="examen-item">
                        <label>
                          <input
                            type="checkbox"
                            name="continenteAlteraciones"
                            checked={continenteAlteraciones}
                            onChange={handleContinenteAlteracionesChange}
                          />
                          Continente: ¿Existen alteraciones?
                        </label>
                        {continenteAlteraciones && (
                          <div className="nested-checkboxes">
                            <div className="examen-item">
                              <label>
                                <input
                                  type="checkbox"
                                  name="esfinterOralAnterior"
                                  checked={continenteOpciones.esfinterOralAnterior}
                                  onChange={handleContinenteOpcionesChange}
                                />
                                Esfínter oral anterior
                              </label>
                              {continenteOpciones.esfinterOralAnterior && (
                                <textarea
                                  name="esfinterOralAnterior"
                                  placeholder="Detalle"
                                  value={continenteDetalles.esfinterOralAnterior}
                                  onChange={handleContinenteDetalleChange}
                                ></textarea>
                              )}
                            </div>

                            <div className="examen-item">
                              <label>
                                <input
                                  type="checkbox"
                                  name="mejillas"
                                  checked={continenteOpciones.mejillas}
                                  onChange={handleContinenteOpcionesChange}
                                />
                                Mejillas
                              </label>
                              {continenteOpciones.mejillas && (
                                <textarea
                                  name="mejillas"
                                  placeholder="Detalle"
                                  value={continenteDetalles.mejillas}
                                  onChange={handleContinenteDetalleChange}
                                ></textarea>
                              )}
                            </div>

                            <div className="examen-item">
                              <label>
                                <input
                                  type="checkbox"
                                  name="paladar"
                                  checked={continenteOpciones.paladar}
                                  onChange={handleContinenteOpcionesChange}
                                />
                                Paladar
                              </label>
                              {continenteOpciones.paladar && (
                                <textarea
                                  name="paladar"
                                  placeholder="Detalle"
                                  value={continenteDetalles.paladar}
                                  onChange={handleContinenteDetalleChange}
                                ></textarea>
                              )}
                            </div>

                            <div className="examen-item">
                              <label>
                                <input
                                  type="checkbox"
                                  name="pisoDeBoca"
                                  checked={continenteOpciones.pisoDeBoca}
                                  onChange={handleContinenteOpcionesChange}
                                />
                                Piso de boca
                              </label>
                              {continenteOpciones.pisoDeBoca && (
                                <textarea
                                  name="pisoDeBoca"
                                  placeholder="Detalle"
                                  value={continenteDetalles.pisoDeBoca}
                                  onChange={handleContinenteDetalleChange}
                                ></textarea>
                              )}
                            </div>

                            <div className="examen-item">
                              <label>
                                <input
                                  type="checkbox"
                                  name="esfinterOralPosterior"
                                  checked={continenteOpciones.esfinterOralPosterior}
                                  onChange={handleContinenteOpcionesChange}
                                />
                                Esfínter oral posterior
                              </label>
                              {continenteOpciones.esfinterOralPosterior && (
                                <textarea
                                  name="esfinterOralPosterior"
                                  placeholder="Detalle"
                                  value={continenteDetalles.esfinterOralPosterior}
                                  onChange={handleContinenteDetalleChange}
                                ></textarea>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* CONTENIDO */}
                    <div className="examen-local-column">
                      <div className="examen-item">
                        <label>
                          <input
                            type="checkbox"
                            name="contenidoAlteraciones"
                            checked={contenidoAlteraciones}
                            onChange={handleContenidoAlteracionesChange}
                          />
                          Contenido: ¿Existen alteraciones?
                        </label>
                        {contenidoAlteraciones && (
                          <div className="nested-checkboxes">
                            <div className="examen-item">
                              <label>
                                <input
                                  type="checkbox"
                                  name="lenguaDorso"
                                  checked={contenidoOpciones.lenguaDorso}
                                  onChange={handleContenidoOpcionesChange}
                                />
                                Lengua dorso
                              </label>
                              {contenidoOpciones.lenguaDorso && (
                                <textarea
                                  name="lenguaDorso"
                                  placeholder="Detalle"
                                  value={contenidoDetalles.lenguaDorso}
                                  onChange={handleContenidoDetalleChange}
                                ></textarea>
                              )}
                            </div>
                            <div className="examen-item">
                              <label>
                                <input
                                  type="checkbox"
                                  name="lenguaVientre"
                                  checked={contenidoOpciones.lenguaVientre}
                                  onChange={handleContenidoOpcionesChange}
                                />
                                Lengua vientre
                              </label>
                              {contenidoOpciones.lenguaVientre && (
                                <textarea
                                  name="lenguaVientre"
                                  placeholder="Detalle"
                                  value={contenidoDetalles.lenguaVientre}
                                  onChange={handleContenidoDetalleChange}
                                ></textarea>
                              )}
                            </div>
                            <div className="examen-item">
                              <label>
                                <input
                                  type="checkbox"
                                  name="lenguaBordes"
                                  checked={contenidoOpciones.lenguaBordes}
                                  onChange={handleContenidoOpcionesChange}
                                />
                                Lengua bordes
                              </label>
                              {contenidoOpciones.lenguaBordes && (
                                <textarea
                                  name="lenguaBordes"
                                  placeholder="Detalle"
                                  value={contenidoDetalles.lenguaBordes}
                                  onChange={handleContenidoDetalleChange}
                                ></textarea>
                              )}
                            </div>
                            <div className="examen-item">
                              <label>
                                <input
                                  type="checkbox"
                                  name="lenguaFrenillo"
                                  checked={contenidoOpciones.lenguaFrenillo}
                                  onChange={handleContenidoOpcionesChange}
                                />
                                Lengua frenillo
                              </label>
                              {contenidoOpciones.lenguaFrenillo && (
                                <textarea
                                  name="lenguaFrenillo"
                                  placeholder="Detalle"
                                  value={contenidoDetalles.lenguaFrenillo}
                                  onChange={handleContenidoDetalleChange}
                                ></textarea>
                              )}
                            </div>
                            <div className="examen-item">
                              <label>
                                <input
                                  type="checkbox"
                                  name="saliva"
                                  checked={contenidoOpciones.saliva}
                                  onChange={handleContenidoOpcionesChange}
                                />
                                Saliva
                              </label>
                              {contenidoOpciones.saliva && (
                                <textarea
                                  name="saliva"
                                  placeholder="Detalle"
                                  value={contenidoDetalles.saliva}
                                  onChange={handleContenidoDetalleChange}
                                ></textarea>
                              )}
                            </div>
                            <div className="examen-item">
                              <label>
                                <input
                                  type="checkbox"
                                  name="rebordesResiduales"
                                  checked={contenidoOpciones.rebordesResiduales}
                                  onChange={handleContenidoOpcionesChange}
                                />
                                Rebordes residuales
                              </label>
                              {contenidoOpciones.rebordesResiduales && (
                                <textarea
                                  name="rebordesResiduales"
                                  placeholder="Detalle"
                                  value={contenidoDetalles.rebordesResiduales}
                                  onChange={handleContenidoDetalleChange}
                                ></textarea>
                              )}
                            </div>
                            <div className="examen-item">
                              <label>
                                <input
                                  type="checkbox"
                                  name="bridasyFrenillos"
                                  checked={contenidoOpciones.bridasyFrenillos}
                                  onChange={handleContenidoOpcionesChange}
                                />
                                Bridas y frenillos
                              </label>
                              {contenidoOpciones.bridasyFrenillos && (
                                <textarea
                                  name="bridasyFrenillos"
                                  placeholder="Detalle"
                                  value={contenidoDetalles.bridasyFrenillos}
                                  onChange={handleContenidoDetalleChange}
                                ></textarea>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="historia-clinica-actions">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="historia-clinica-button historia-clinica-button-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="historia-clinica-button historia-clinica-button-primary"
              >
                {loading ? 'Guardando...' : 'Guardar Historia Clínica'}
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
                className="historia-clinica-button historia-clinica-button-secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancelar
              </button>
              <button
                className="historia-clinica-button historia-clinica-button-primary"
                onClick={confirmCancel}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {fechaUltimaActualizacion && (
        <div className="fecha-historia-clinica" style={{textAlign: 'right', color: '#888', fontSize: '0.95rem', marginBottom: '1rem'}}>
          Última actualización: {new Date(fechaUltimaActualizacion).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default HistoriaClinica; 