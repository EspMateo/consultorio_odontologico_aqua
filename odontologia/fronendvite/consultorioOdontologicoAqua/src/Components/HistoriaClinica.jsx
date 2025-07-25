import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { buildApiUrl } from '../config';
import './styles/HistoriaClinica.css';

const HistoriaClinica = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estados principales
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(location.state?.paciente || null);
  const [pacientes, setPacientes] = useState([]);
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('info'); // 'success', 'error', 'info'
  const [historiaActual, setHistoriaActual] = useState(null);
  const [isModifying, setIsModifying] = useState(false);

  // Función para mostrar mensajes
  const showMessage = (msg, type = 'info', duration = 5000) => {
    setMessage(msg);
    setMessageType(type);
    
    // Para mensajes de éxito, mostrar por más tiempo
    const displayDuration = type === 'success' ? 8000 : duration;
    
    if (displayDuration > 0) {
      setTimeout(() => {
        setMessage(null);
        setMessageType('info');
      }, displayDuration);
    }
  };

  // Función para limpiar mensajes
  const clearMessage = () => {
    setMessage(null);
    setMessageType('info');
  };

  // Estados del formulario
  const [formData, setFormData] = useState({
    motivoConsulta: '',
    cepilladoDental: '',
    cepilladoEncias: '',
    cepilladoLingual: '',
    observacionesHigienicas: '',
    usaHiloDental: false,
    higieneProtesica: false,
    fumador: false,
    consumeCafe: false,
    consumeTe: false,
    consumeMate: false,
    consumeAlcohol: false,
    consumeDrogas: false,
    tieneEnfermedades: false,
    noTieneEnfermedades: true,
    enfermedadesActuales: '',
    alergias: false,
    alergiasDetalle: '',
    tomaMedicamentos: false,
    noTomaMedicamentos: true,
    medicamentos: '',
    posologia: '',
    tomaBifosfonatos: false,
    antecedentesFamiliares: '',
    enTratamiento: false,
    apreciacionGeneral: {
      lucido: false,
      apiretico: false,
      colaborador: false,
      ambulatorio: false
    },
    apreciacionGeneralDetalle: '',
    examenRegional: {
      facies: false,
      cuello: false,
      ganglios: false,
      atm: false,
      macizoFacial: false,
      mandibula: false,
      musculos: false,
      meso: false,
      dolico: false,
      braqui: false
    },
    examenRegionalDetalle: '',
    continenteAlteraciones: false,
    continenteOpciones: {
      esfinterOralAnterior: false,
      mejillas: false,
      paladar: false,
      pisoDeBoca: false,
      esfinterOralPosterior: false
    },
    contenidoAlteraciones: false,
    contenidoOpciones: {
      lenguaDorso: false,
      lenguaVientre: false,
      lenguaBordes: false,
      lenguaFrenillo: false,
      saliva: false,
      rebordesResiduales: false,
      bridasyFrenillos: false
    }
  });

  // Cargar pacientes al montar el componente
  useEffect(() => {
    if (!pacienteSeleccionado) {
      cargarPacientes();
    }
  }, []);

  // Cargar fechas cuando se selecciona un paciente
  useEffect(() => {
    if (pacienteSeleccionado?.id) {
      cargarFechasDisponibles();
    }
  }, [pacienteSeleccionado]);

  // Cargar datos cuando se selecciona una fecha
  useEffect(() => {
    if (pacienteSeleccionado?.id && fechaSeleccionada) {
      cargarDatosHistoriaClinica();
    }
  }, [fechaSeleccionada]);

  // Forzar re-render cuando se actualiza formData
  useEffect(() => {
    console.log('FormData actualizado:', formData);
  }, [formData]);

  const cargarPacientes = async () => {
    try {
      const response = await axios.get(buildApiUrl('pacientes'));
      setPacientes(response.data);
    } catch (error) {
      showMessage('Error al cargar pacientes', 'error');
    }
  };

  const cargarFechasDisponibles = async () => {
    try {
      const response = await axios.get(buildApiUrl(`historia-clinica/paciente/${pacienteSeleccionado.id}/fechas`));
      setFechasDisponibles(response.data);
      clearMessage();
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Error al cargar fechas disponibles';
      showMessage(errorMsg, 'error');
      setFechasDisponibles([]);
    }
  };

  const cargarDatosHistoriaClinica = async () => {
    try {
      setLoading(true);
      console.log('Cargando datos para paciente:', pacienteSeleccionado.id, 'fecha:', fechaSeleccionada);
      
      const response = await axios.get(buildApiUrl(`historia-clinica/paciente/${pacienteSeleccionado.id}/fecha/${fechaSeleccionada}`));
      const data = response.data;
      
      console.log('Respuesta del servidor:', data);
      console.log('Tipo de datos recibidos:', typeof data);
      console.log('Keys del objeto:', Object.keys(data));
      
      if (data) {
        console.log('Datos específicos:', {
          motivoConsulta: data.motivoConsulta,
          cepilladoDental: data.cepilladoDental,
          usaHiloDental: data.usaHiloDental,
          fumador: data.fumador,
          enfermedadesActuales: data.enfermedadesActuales,
          alergias: data.alergias,
          medicamentos: data.medicamentos,
          examenLocal: data.examenLocal
        });
      }
      
      cargarDatosEnFormulario(data);
      setHistoriaActual(data);
      setIsModifying(true);
      showMessage('Historia clínica cargada correctamente', 'success');
      
    } catch (error) {
      console.error('Error al cargar datos:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Error al cargar datos de la fecha seleccionada';
      showMessage(errorMsg, 'error');
      limpiarDatos();
    } finally {
      setLoading(false);
    }
  };

  const cargarDatosEnFormulario = (data) => {
    console.log('Datos recibidos del servidor:', data); // Debug
    
    // Asignar datos directamente como en Periodoncia
    setFormData({
      motivoConsulta: data.motivoConsulta || '',
      cepilladoDental: data.cepilladoDental || '',
      cepilladoEncias: data.cepilladoEncias || '',
      cepilladoLingual: data.cepilladoLingual || '',
      observacionesHigienicas: data.observacionesHigienicas || '',
      usaHiloDental: data.usaHiloDental === true || data.usaHiloDental === 1,
      higieneProtesica: data.higieneProtesica === true || data.higieneProtesica === 1,
      fumador: data.fumador === true || data.fumador === 1,
      consumeCafe: data.consumeCafe === true || data.consumeCafe === 1,
      consumeTe: data.consumeTe === true || data.consumeTe === 1,
      consumeMate: data.consumeMate === true || data.consumeMate === 1,
      consumeAlcohol: data.consumeAlcohol === true || data.consumeAlcohol === 1,
      consumeDrogas: data.consumeDrogas === true || data.consumeDrogas === 1,
      tieneEnfermedades: data.enfermedadesActuales && data.enfermedadesActuales.trim() !== '',
      noTieneEnfermedades: !(data.enfermedadesActuales && data.enfermedadesActuales.trim() !== ''),
      enfermedadesActuales: data.enfermedadesActuales || '',
      alergias: data.alergias && data.alergias.trim() !== '',
      alergiasDetalle: data.alergias || '',
      tomaMedicamentos: data.medicamentos && data.medicamentos.trim() !== '',
      noTomaMedicamentos: !(data.medicamentos && data.medicamentos.trim() !== ''),
      medicamentos: data.medicamentos || '',
      posologia: data.posologia || '',
      tomaBifosfonatos: data.tomaBifosfonatos === true || data.tomaBifosfonatos === 1,
      antecedentesFamiliares: data.antecedentesFamiliares || '',
      enTratamiento: data.enTratamiento === true || data.enTratamiento === 1,
      apreciacionGeneral: {
        lucido: data.apreciacionGeneral?.includes('Lúcido') || false,
        apiretico: data.apreciacionGeneral?.includes('Apirético') || false,
        colaborador: data.apreciacionGeneral?.includes('Colaborador') || false,
        ambulatorio: data.apreciacionGeneral?.includes('Ambulatorio') || false
      },
      apreciacionGeneralDetalle: data.apreciacionGeneralDetalle || '',
      examenRegional: {
        facies: data.examenRegional?.includes('Facies') || false,
        cuello: data.examenRegional?.includes('Cuello') || false,
        ganglios: data.examenRegional?.includes('Ganglios') || false,
        atm: data.examenRegional?.includes('ATM') || false,
        macizoFacial: data.examenRegional?.includes('Macizo facial') || false,
        mandibula: data.examenRegional?.includes('Mandíbula') || false,
        musculos: data.examenRegional?.includes('Músculos') || false,
        meso: data.examenRegional?.includes('Meso') || false,
        dolico: data.examenRegional?.includes('Dólico') || false,
        braqui: data.examenRegional?.includes('Braqui') || false
      },
      examenRegionalDetalle: data.examenRegionalDetalle || '',
      continenteAlteraciones: data.examenLocal && data.examenLocal.trim() !== '',
      continenteOpciones: {
        esfinterOralAnterior: data.examenLocal?.includes('Esfínter oral anterior') || false,
        mejillas: data.examenLocal?.includes('Mejillas') || false,
        paladar: data.examenLocal?.includes('Paladar') || false,
        pisoDeBoca: data.examenLocal?.includes('Piso de boca') || false,
        esfinterOralPosterior: data.examenLocal?.includes('Esfínter oral posterior') || false
      },
      contenidoAlteraciones: false,
      contenidoOpciones: {
        lenguaDorso: false,
        lenguaVientre: false,
        lenguaBordes: false,
        lenguaFrenillo: false,
        saliva: false,
        rebordesResiduales: false,
        bridasyFrenillos: false
      }
    });
    
    console.log('FormData actualizado:', {
      motivoConsulta: data.motivoConsulta || '',
      cepilladoDental: data.cepilladoDental || '',
      usaHiloDental: data.usaHiloDental === true || data.usaHiloDental === 1,
      fumador: data.fumador === true || data.fumador === 1,
      tieneEnfermedades: data.enfermedadesActuales && data.enfermedadesActuales.trim() !== '',
      enfermedadesActuales: data.enfermedadesActuales || '',
      alergias: data.alergias && data.alergias.trim() !== '',
      tomaMedicamentos: data.medicamentos && data.medicamentos.trim() !== '',
      medicamentos: data.medicamentos || '',
      continenteAlteraciones: data.examenLocal && data.examenLocal.trim() !== ''
    });
  };

  const limpiarDatos = () => {
    setFormData({
      motivoConsulta: '',
      cepilladoDental: '',
      cepilladoEncias: '',
      cepilladoLingual: '',
      observacionesHigienicas: '',
      usaHiloDental: false,
      higieneProtesica: false,
      fumador: false,
      consumeCafe: false,
      consumeTe: false,
      consumeMate: false,
      consumeAlcohol: false,
      consumeDrogas: false,
      tieneEnfermedades: false,
      noTieneEnfermedades: true,
      enfermedadesActuales: '',
      alergias: false,
      alergiasDetalle: '',
      tomaMedicamentos: false,
      noTomaMedicamentos: true,
      medicamentos: '',
      posologia: '',
      tomaBifosfonatos: false,
      antecedentesFamiliares: '',
      enTratamiento: false,
      apreciacionGeneral: {
        lucido: false,
        apiretico: false,
        colaborador: false,
        ambulatorio: false
      },
      apreciacionGeneralDetalle: '',
      examenRegional: {
        facies: false,
        cuello: false,
        ganglios: false,
        atm: false,
        macizoFacial: false,
        mandibula: false,
        musculos: false,
        meso: false,
        dolico: false,
        braqui: false
      },
      examenRegionalDetalle: '',
      continenteAlteraciones: false,
      continenteOpciones: {
        esfinterOralAnterior: false,
        mejillas: false,
        paladar: false,
        pisoDeBoca: false,
        esfinterOralPosterior: false
      },
      contenidoAlteraciones: false,
      contenidoOpciones: {
        lenguaDorso: false,
        lenguaVientre: false,
        lenguaBordes: false,
        lenguaFrenillo: false,
        saliva: false,
        rebordesResiduales: false,
        bridasyFrenillos: false
      }
    });
    setHistoriaActual(null);
    setIsModifying(false);
  };

  const handlePacienteChange = (pacienteId) => {
    const paciente = pacientes.find(p => p.id == pacienteId);
    setPacienteSeleccionado(paciente);
    setFechaSeleccionada('');
    limpiarDatos();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field) => (event) => {
    setFormData(prev => ({ ...prev, [field]: event.target.checked }));
  };

  const handleApreciacionGeneralChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      apreciacionGeneral: {
        ...prev.apreciacionGeneral,
        [field]: event.target.checked
      }
    }));
  };

  const handleExamenRegionalChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      examenRegional: {
        ...prev.examenRegional,
        [field]: event.target.checked
      }
    }));
  };

  const handleContinenteOpcionesChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      continenteOpciones: {
        ...prev.continenteOpciones,
        [field]: event.target.checked
      }
    }));
  };

  const handleContenidoOpcionesChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      contenidoOpciones: {
        ...prev.contenidoOpciones,
        [field]: event.target.checked
      }
    }));
  };

  const buildApreciacionGeneral = () => {
    const apreciaciones = [];
    if (formData.apreciacionGeneral.lucido) apreciaciones.push('Lúcido');
    if (formData.apreciacionGeneral.apiretico) apreciaciones.push('Apirético');
    if (formData.apreciacionGeneral.colaborador) apreciaciones.push('Colaborador');
    if (formData.apreciacionGeneral.ambulatorio) apreciaciones.push('Ambulatorio');
    return apreciaciones.join(', ');
  };

  const buildExamenRegional = () => {
    const examenes = [];
    if (formData.examenRegional.facies) examenes.push('Facies');
    if (formData.examenRegional.cuello) examenes.push('Cuello');
    if (formData.examenRegional.ganglios) examenes.push('Ganglios');
    if (formData.examenRegional.atm) examenes.push('ATM');
    if (formData.examenRegional.macizoFacial) examenes.push('Macizo facial');
    if (formData.examenRegional.mandibula) examenes.push('Mandíbula');
    if (formData.examenRegional.musculos) examenes.push('Músculos');
    if (formData.examenRegional.meso) examenes.push('Meso');
    if (formData.examenRegional.dolico) examenes.push('Dólico');
    if (formData.examenRegional.braqui) examenes.push('Braqui');
    return examenes.join(', ');
  };

  const buildExamenLocal = () => {
    if (!formData.continenteAlteraciones) return '';
    
    const continenteItems = [];
    if (formData.continenteOpciones.esfinterOralAnterior) continenteItems.push('Esfínter oral anterior');
    if (formData.continenteOpciones.mejillas) continenteItems.push('Mejillas');
    if (formData.continenteOpciones.paladar) continenteItems.push('Paladar');
    if (formData.continenteOpciones.pisoDeBoca) continenteItems.push('Piso de boca');
    if (formData.continenteOpciones.esfinterOralPosterior) continenteItems.push('Esfínter oral posterior');
    return `Continente alterado: ${continenteItems.join(', ')}`;
  };

  const handleGuardar = async () => {
    if (!pacienteSeleccionado) {
      showMessage('Por favor seleccione un paciente', 'error');
      return;
    }

    setLoading(true);
    try {
      const historiaClinicaData = {
        paciente: { id: pacienteSeleccionado.id },
        motivoConsulta: formData.motivoConsulta,
        cepilladoDental: formData.cepilladoDental,
        cepilladoEncias: formData.cepilladoEncias,
        cepilladoLingual: formData.cepilladoLingual,
        observacionesHigienicas: formData.observacionesHigienicas,
        usaHiloDental: formData.usaHiloDental,
        higieneProtesica: formData.higieneProtesica,
        fumador: formData.fumador,
        consumeCafe: formData.consumeCafe,
        consumeTe: formData.consumeTe,
        consumeMate: formData.consumeMate,
        consumeAlcohol: formData.consumeAlcohol,
        consumeDrogas: formData.consumeDrogas,
        enfermedadesActuales: formData.tieneEnfermedades ? formData.enfermedadesActuales : '',
        medicamentos: formData.tomaMedicamentos ? formData.medicamentos : '',
        alergias: formData.alergias ? formData.alergiasDetalle : '',
        posologia: formData.posologia,
        antecedentesFamiliares: formData.antecedentesFamiliares,
        enTratamiento: formData.enTratamiento,
        tomaBifosfonatos: formData.tomaBifosfonatos,
        apreciacionGeneral: buildApreciacionGeneral(),
        apreciacionGeneralDetalle: formData.apreciacionGeneralDetalle,
        examenRegional: buildExamenRegional(),
        examenRegionalDetalle: formData.examenRegionalDetalle,
        examenLocal: buildExamenLocal(),
        examenLocalDetalle: '',
        usuario: { id: 1 }
      };

      const response = await axios.post(buildApiUrl('historia-clinica'), historiaClinicaData);
      
      const successMsg = response.data.message || 'Historia clínica guardada exitosamente';
      showMessage(successMsg, 'success');
      
      // Recargar fechas disponibles
      await cargarFechasDisponibles();
      
      // Si no hay fecha seleccionada, seleccionar la fecha actual
      if (!fechaSeleccionada) {
        const today = new Date().toISOString().split('T')[0];
        setFechaSeleccionada(today);
      }
      
      // Recargar los datos para mostrar el estado actual
      if (fechaSeleccionada) {
        await cargarDatosHistoriaClinica();
      }
      
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Error al guardar la historia clínica';
      showMessage(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleModificar = async () => {
    if (!historiaActual) {
      showMessage('No hay datos para modificar', 'error');
      return;
    }

    setLoading(true);
    try {
      const historiaClinicaData = {
        paciente: { id: pacienteSeleccionado.id },
        motivoConsulta: formData.motivoConsulta,
        cepilladoDental: formData.cepilladoDental,
        cepilladoEncias: formData.cepilladoEncias,
        cepilladoLingual: formData.cepilladoLingual,
        observacionesHigienicas: formData.observacionesHigienicas,
        usaHiloDental: formData.usaHiloDental,
        higieneProtesica: formData.higieneProtesica,
        fumador: formData.fumador,
        consumeCafe: formData.consumeCafe,
        consumeTe: formData.consumeTe,
        consumeMate: formData.consumeMate,
        consumeAlcohol: formData.consumeAlcohol,
        consumeDrogas: formData.consumeDrogas,
        enfermedadesActuales: formData.tieneEnfermedades ? formData.enfermedadesActuales : '',
        medicamentos: formData.tomaMedicamentos ? formData.medicamentos : '',
        alergias: formData.alergias ? formData.alergiasDetalle : '',
        posologia: formData.posologia,
        antecedentesFamiliares: formData.antecedentesFamiliares,
        enTratamiento: formData.enTratamiento,
        tomaBifosfonatos: formData.tomaBifosfonatos,
        apreciacionGeneral: buildApreciacionGeneral(),
        apreciacionGeneralDetalle: formData.apreciacionGeneralDetalle,
        examenRegional: buildExamenRegional(),
        examenRegionalDetalle: formData.examenRegionalDetalle,
        examenLocal: buildExamenLocal(),
        examenLocalDetalle: '',
        usuario: { id: 1 }
      };

      const response = await axios.put(buildApiUrl(`historia-clinica/${historiaActual.id}`), historiaClinicaData);
      
      const successMsg = response.data.message || 'Historia clínica modificada exitosamente';
      showMessage(successMsg, 'success');
      
      // Recargar los datos para mostrar el estado actual
      await cargarDatosHistoriaClinica();
      
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Error al modificar la historia clínica';
      showMessage(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate('/dashboard');
  };

  return (
    <div className="historia-clinica-container">
      <div className="historia-clinica-header">
        <h1>Historia Clínica</h1>
      </div>
      
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      
      <div className="historia-clinica-content">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Cargando datos...</p>
          </div>
        )}
        
        <div className="form-section">
          {/* Selección de paciente y fecha */}
          <div className="form-row">
            {!pacienteSeleccionado && (
              <div className="form-group">
                <label>Paciente:</label>
                <select 
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
            )}
            
            {pacienteSeleccionado && (
              <div className="form-group">
                <label>Paciente:</label>
                <span className="paciente-info">{pacienteSeleccionado.name} {pacienteSeleccionado.lastname}</span>
              </div>
            )}

            <div className="form-group">
              <label>Fechas Disponibles:</label>
              <select 
                value={fechaSeleccionada} 
                onChange={(e) => setFechaSeleccionada(e.target.value)}
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

          {/* Información Personal */}
          <div className="section">
            <h3>Información Personal</h3>
            <div className="form-group">
              <label>Motivo de consulta:</label>
              <textarea
                value={formData.motivoConsulta}
                onChange={(e) => handleInputChange('motivoConsulta', e.target.value)}
                placeholder="Describa el motivo de la consulta"
                rows="3"
                className="form-textarea"
              />
            </div>
          </div>

          {/* Hábitos */}
          <div className="section">
            <h3>Hábitos de Higiene</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Cepillado dental (veces por día):</label>
                <input
                  type="number"
                  value={formData.cepilladoDental}
                  onChange={(e) => handleInputChange('cepilladoDental', e.target.value)}
                  min="0"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Cepillado de encías (veces por día):</label>
                <input
                  type="number"
                  value={formData.cepilladoEncias}
                  onChange={(e) => handleInputChange('cepilladoEncias', e.target.value)}
                  min="0"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Cepillado lingual (veces por día):</label>
                <input
                  type="number"
                  value={formData.cepilladoLingual}
                  onChange={(e) => handleInputChange('cepilladoLingual', e.target.value)}
                  min="0"
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.usaHiloDental}
                  onChange={handleCheckboxChange('usaHiloDental')}
                />
                Usa Hilo dental
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.higieneProtesica}
                  onChange={handleCheckboxChange('higieneProtesica')}
                />
                Higiene protésica
              </label>
            </div>

            <div className="form-group">
              <label>Observaciones Higiénicas:</label>
              <textarea
                value={formData.observacionesHigienicas}
                onChange={(e) => handleInputChange('observacionesHigienicas', e.target.value)}
                placeholder="Campo para observaciones de higiene"
                rows="3"
                className="form-textarea"
              />
            </div>
          </div>

          {/* Hábitos y Consumo */}
          <div className="section">
            <h3>Hábitos y Consumo</h3>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.fumador}
                  onChange={handleCheckboxChange('fumador')}
                />
                Fumador
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.consumeCafe}
                  onChange={handleCheckboxChange('consumeCafe')}
                />
                Consume café
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.consumeTe}
                  onChange={handleCheckboxChange('consumeTe')}
                />
                Consume té
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.consumeMate}
                  onChange={handleCheckboxChange('consumeMate')}
                />
                Consume mate
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.consumeAlcohol}
                  onChange={handleCheckboxChange('consumeAlcohol')}
                />
                Consume alcohol
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.consumeDrogas}
                  onChange={handleCheckboxChange('consumeDrogas')}
                />
                Consume drogas
              </label>
            </div>
          </div>

          {/* Antecedentes Médicos */}
          <div className="section">
            <h3>Antecedentes Médicos</h3>
            
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.tieneEnfermedades}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      tieneEnfermedades: e.target.checked,
                      noTieneEnfermedades: !e.target.checked
                    }));
                  }}
                />
                Tiene enfermedades
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.noTieneEnfermedades}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      noTieneEnfermedades: e.target.checked,
                      tieneEnfermedades: !e.target.checked
                    }));
                  }}
                />
                No tiene enfermedades
              </label>
            </div>

            {formData.tieneEnfermedades && (
              <div className="form-group">
                <label>Enfermedades actuales:</label>
                <textarea
                  value={formData.enfermedadesActuales}
                  onChange={(e) => handleInputChange('enfermedadesActuales', e.target.value)}
                  placeholder="Describa las enfermedades actuales"
                  rows="3"
                  className="form-textarea"
                />
              </div>
            )}

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.alergias}
                  onChange={handleCheckboxChange('alergias')}
                />
                Alergias
              </label>
            </div>

            {formData.alergias && (
              <div className="form-group">
                <label>Especificar Alergias:</label>
                <textarea
                  value={formData.alergiasDetalle}
                  onChange={(e) => handleInputChange('alergiasDetalle', e.target.value)}
                  placeholder="Detalle las alergias"
                  rows="3"
                  className="form-textarea"
                />
              </div>
            )}

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.tomaMedicamentos}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      tomaMedicamentos: e.target.checked,
                      noTomaMedicamentos: !e.target.checked
                    }));
                  }}
                />
                Toma medicaciones
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.noTomaMedicamentos}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      noTomaMedicamentos: e.target.checked,
                      tomaMedicamentos: !e.target.checked
                    }));
                  }}
                />
                No toma medicaciones
              </label>
            </div>

            {formData.tomaMedicamentos && (
              <>
                <div className="form-group">
                  <label>Medicamentos que toma:</label>
                  <textarea
                    value={formData.medicamentos}
                    onChange={(e) => handleInputChange('medicamentos', e.target.value)}
                    placeholder="Liste los medicamentos"
                    rows="3"
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label>Posología y Comentarios:</label>
                  <textarea
                    value={formData.posologia}
                    onChange={(e) => handleInputChange('posologia', e.target.value)}
                    placeholder="Detalle la posología y otros comentarios"
                    rows="3"
                    className="form-textarea"
                  />
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.tomaBifosfonatos}
                      onChange={handleCheckboxChange('tomaBifosfonatos')}
                    />
                    Toma Bifosfonatos
                  </label>
                </div>
              </>
            )}

            {formData.tieneEnfermedades && (
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.enTratamiento}
                    onChange={handleCheckboxChange('enTratamiento')}
                  />
                  Está en tratamiento
                </label>
              </div>
            )}
          </div>

          {/* Antecedentes Familiares */}
          <div className="section">
            <h3>Antecedentes Familiares</h3>
            <div className="form-group">
              <label>Antecedentes Familiares:</label>
              <textarea
                value={formData.antecedentesFamiliares}
                onChange={(e) => handleInputChange('antecedentesFamiliares', e.target.value)}
                placeholder="Describa los antecedentes familiares relevantes"
                rows="3"
                className="form-textarea"
              />
            </div>
          </div>

          {/* Apreciación General */}
          <div className="section">
            <h3>Apreciación General</h3>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.apreciacionGeneral.lucido}
                  onChange={handleApreciacionGeneralChange('lucido')}
                />
                Lúcido
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.apreciacionGeneral.apiretico}
                  onChange={handleApreciacionGeneralChange('apiretico')}
                />
                Apirético
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.apreciacionGeneral.colaborador}
                  onChange={handleApreciacionGeneralChange('colaborador')}
                />
                Colaborador
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.apreciacionGeneral.ambulatorio}
                  onChange={handleApreciacionGeneralChange('ambulatorio')}
                />
                Ambulatorio
              </label>
            </div>
            <div className="form-group">
              <label>Detalle apreciación general:</label>
              <textarea
                value={formData.apreciacionGeneralDetalle}
                onChange={(e) => handleInputChange('apreciacionGeneralDetalle', e.target.value)}
                placeholder="Detalle apreciación general"
                rows="3"
                className="form-textarea"
              />
            </div>
          </div>

          {/* Examen Regional */}
          <div className="section">
            <h3>Examen Regional</h3>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.examenRegional.facies}
                  onChange={handleExamenRegionalChange('facies')}
                />
                Facies
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.examenRegional.cuello}
                  onChange={handleExamenRegionalChange('cuello')}
                />
                Cuello
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.examenRegional.ganglios}
                  onChange={handleExamenRegionalChange('ganglios')}
                />
                Ganglios
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.examenRegional.atm}
                  onChange={handleExamenRegionalChange('atm')}
                />
                ATM
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.examenRegional.macizoFacial}
                  onChange={handleExamenRegionalChange('macizoFacial')}
                />
                Macizo facial
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.examenRegional.mandibula}
                  onChange={handleExamenRegionalChange('mandibula')}
                />
                Mandíbula
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.examenRegional.musculos}
                  onChange={handleExamenRegionalChange('musculos')}
                />
                Músculos
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.examenRegional.meso}
                  onChange={handleExamenRegionalChange('meso')}
                />
                Meso
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.examenRegional.dolico}
                  onChange={handleExamenRegionalChange('dolico')}
                />
                Dólico
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.examenRegional.braqui}
                  onChange={handleExamenRegionalChange('braqui')}
                />
                Braqui
              </label>
            </div>
            <div className="form-group">
              <label>Detalle examen regional:</label>
              <textarea
                value={formData.examenRegionalDetalle}
                onChange={(e) => handleInputChange('examenRegionalDetalle', e.target.value)}
                placeholder="Detalle examen regional"
                rows="3"
                className="form-textarea"
              />
            </div>
          </div>

          {/* Examen Local */}
          <div className="section">
            <h3>Examen Local</h3>
            
            {/* Continente */}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.continenteAlteraciones}
                  onChange={(e) => setFormData(prev => ({ ...prev, continenteAlteraciones: e.target.checked }))}
                />
                Continente: ¿Existen alteraciones?
              </label>
            </div>

            {formData.continenteAlteraciones && (
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.continenteOpciones.esfinterOralAnterior}
                    onChange={handleContinenteOpcionesChange('esfinterOralAnterior')}
                  />
                  Esfínter oral anterior
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.continenteOpciones.mejillas}
                    onChange={handleContinenteOpcionesChange('mejillas')}
                  />
                  Mejillas
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.continenteOpciones.paladar}
                    onChange={handleContinenteOpcionesChange('paladar')}
                  />
                  Paladar
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.continenteOpciones.pisoDeBoca}
                    onChange={handleContinenteOpcionesChange('pisoDeBoca')}
                  />
                  Piso de boca
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.continenteOpciones.esfinterOralPosterior}
                    onChange={handleContinenteOpcionesChange('esfinterOralPosterior')}
                  />
                  Esfínter oral posterior
                </label>
              </div>
            )}

            {/* Contenido */}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.contenidoAlteraciones}
                  onChange={(e) => setFormData(prev => ({ ...prev, contenidoAlteraciones: e.target.checked }))}
                />
                Contenido: ¿Existen alteraciones?
              </label>
            </div>

            {formData.contenidoAlteraciones && (
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.contenidoOpciones.lenguaDorso}
                    onChange={handleContenidoOpcionesChange('lenguaDorso')}
                  />
                  Lengua dorso
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.contenidoOpciones.lenguaVientre}
                    onChange={handleContenidoOpcionesChange('lenguaVientre')}
                  />
                  Lengua vientre
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.contenidoOpciones.lenguaBordes}
                    onChange={handleContenidoOpcionesChange('lenguaBordes')}
                  />
                  Lengua bordes
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.contenidoOpciones.lenguaFrenillo}
                    onChange={handleContenidoOpcionesChange('lenguaFrenillo')}
                  />
                  Lengua frenillo
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.contenidoOpciones.saliva}
                    onChange={handleContenidoOpcionesChange('saliva')}
                  />
                  Saliva
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.contenidoOpciones.rebordesResiduales}
                    onChange={handleContenidoOpcionesChange('rebordesResiduales')}
                  />
                  Rebordes residuales
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.contenidoOpciones.bridasyFrenillos}
                    onChange={handleContenidoOpcionesChange('bridasyFrenillos')}
                  />
                  Bridas y frenillos
                </label>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="acciones-section">
            <div className="botones-container">
              <button 
                className="btn-guardar" 
                onClick={handleGuardar}
                disabled={loading || !pacienteSeleccionado}
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

export default HistoriaClinica; 