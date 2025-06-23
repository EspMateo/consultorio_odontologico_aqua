import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import MessageDisplay from './MessageDisplay';
import './styles/HistoriaClinica.css';

const HistoriaClinica = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paciente, setPaciente] = useState(null);
  const [displayMessage, setDisplayMessage] = useState(null);
  const [messageType, setMessageType] = useState('info');
  const [consumeDrogas, setConsumeDrogas] = useState(false);
  const [consumeBebidas, setConsumeBebidas] = useState(false);
  const [higieneProtesica, setHigieneProtesica] = useState(false);
  const [usaHiloDental, setUsaHiloDental] = useState(false);
  const [alergias, setAlergias] = useState(false);
  const [tomaMedicamentos, setTomaMedicamentos] = useState(false);
  const [consumeTe, setConsumeTe] = useState(false);
  const [consumeCafe, setConsumeCafe] = useState(false);
  const [consumeMate, setConsumeMate] = useState(false);
  const [noTomaMedicamentos, setNoTomaMedicamentos] = useState(false);
  const [tieneEnfermedades, setTieneEnfermedades] = useState(false);
  const [noTieneEnfermedades, setNoTieneEnfermedades] = useState(false);
  const [enfermedadesSeleccionadas, setEnfermedadesSeleccionadas] = useState({
    cardiovasculares: false,
    diabetes: false,
    ets: false,
    otros: false,
  });
  const [otrasEnfermedadesDetalle, setOtrasEnfermedadesDetalle] = useState('');
  const [enTratamiento, setEnTratamiento] = useState(false);
  const [tomaBifosfonatos, setTomaBifosfonatos] = useState(false);
  const [dietaCariogenica, setDietaCariogenica] = useState(false);
  const [apreciacionGeneral, setApreciacionGeneral] = useState({
    lucido: false,
    apiretico: false,
    colaborador: false,
    ambulatorio: false,
  });
  const [examenRegional, setExamenRegional] = useState({
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
  });
  const [examenRegionalDetalles, setExamenRegionalDetalles] = useState({
    facies: '',
    cuello: '',
    ganglios: '',
    atm: '',
    macizoFacial: '',
    mandibula: '',
    musculos: '',
  });
  const [continenteAlteraciones, setContinenteAlteraciones] = useState(false);
  const [continenteOpciones, setContinenteOpciones] = useState({
    esfinterOralAnterior: false,
    mejillas: false,
    paladar: false,
    pisoDeBoca: false,
    esfinterOralPosterior: false,
  });
  const [continenteDetalles, setContinenteDetalles] = useState({
    esfinterOralAnterior: '',
    mejillas: '',
    paladar: '',
    pisoDeBoca: '',
    esfinterOralPosterior: '',
  });
  const [contenidoAlteraciones, setContenidoAlteraciones] = useState(false);
  const [contenidoOpciones, setContenidoOpciones] = useState({
    lenguaDorso: false,
    lenguaVientre: false,
    lenguaBordes: false,
    lenguaFrenillo: false,
    saliva: false,
    rebordesResiduales: false,
    bridasyFrenillos: false,
  });
  const [contenidoDetalles, setContenidoDetalles] = useState({
    lenguaDorso: '',
    lenguaVientre: '',
    lenguaBordes: '',
    lenguaFrenillo: '',
    saliva: '',
    rebordesResiduales: '',
    bridasyFrenillos: '',
  });
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [formData, setFormData] = useState({
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [fumador, setFumador] = useState(false);
  const [consumeAlcohol, setConsumeAlcohol] = useState(false);
  const [historiaClinicaId, setHistoriaClinicaId] = useState(null);
  const [fechaUltimaActualizacion, setFechaUltimaActualizacion] = useState(null);

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
    } catch (error) {
      console.error('Error al cargar paciente:', error);
      setError('Error al cargar los datos del paciente');
      setDisplayMessage('Error al cargar los datos del paciente.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoriaClinica = async (pacienteId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/historia-clinica/paciente/${pacienteId}`);
      if (response.data) {
        setHistoriaClinicaId(response.data.id);
        setFechaUltimaActualizacion(response.data.fecha);
        setFormData({
          motivoConsulta: response.data.motivoConsulta || '',
          cepilladoDental: response.data.cepilladoDental || '',
          cepilladoEncias: response.data.cepilladoEncias || '',
          cepilladoLingual: response.data.cepilladoLingual || '',
          observacionesHigienicas: response.data.observacionesHigienicas || '',
          enfermedadesActuales: response.data.enfermedadesActuales || '',
          medicamentos: response.data.medicamentos || '',
          alergiasDetalle: response.data.alergias || '',
          posologia: response.data.posologia || '',
          antecedentesFamiliares: response.data.antecedentesFamiliares || '',
          apreciacionGeneral: response.data.apreciacionGeneral || '',
          apreciacionGeneralDetalle: response.data.apreciacionGeneralDetalle || '',
          examenRegional: response.data.examenRegional || '',
          examenRegionalDetalle: response.data.examenRegionalDetalle || '',
          examenLocal: response.data.examenLocal || '',
          examenLocalDetalle: response.data.examenLocalDetalle || ''
        });
        setUsaHiloDental(response.data.usaHiloDental || false);
        setHigieneProtesica(response.data.higieneProtesica || false);
        setFumador(response.data.fumador || false);
        setConsumeCafe(response.data.consumeCafe || false);
        setConsumeTe(response.data.consumeTe || false);
        setConsumeMate(response.data.consumeMate || false);
        setConsumeAlcohol(response.data.consumeAlcohol || false);
        setConsumeDrogas(response.data.consumeDrogas || false);
        // Aquí puedes setear otros estados booleanos/objetos si los tienes
      }
    } catch (error) {
      // Si no hay historia clínica, no hacer nada
    }
  };

  const handleDismissMessage = () => {
    setDisplayMessage(null);
    setMessageType('info');
  };

  const handleCheckboxChange = (setter) => (event) => {
    setter(event.target.checked);
  };

  const handleMedicacionChange = (field) => (event) => {
    if (field === 'tomaMedicamentos') {
      setTomaMedicamentos(event.target.checked);
      if (event.target.checked) {
        setNoTomaMedicamentos(false);
      }
    } else if (field === 'noTomaMedicamentos') {
      setNoTomaMedicamentos(event.target.checked);
      if (event.target.checked) {
        setTomaMedicamentos(false);
      }
    }
  };

  const handleTieneEnfermedadesChange = (field) => (event) => {
    if (field === 'tieneEnfermedades') {
      setTieneEnfermedades(event.target.checked);
      if (event.target.checked) {
        setNoTieneEnfermedades(false);
      } else {
        // Resetear selecciones y detalles si se desmarca 'Sí'
        setEnfermedadesSeleccionadas({
          cardiovasculares: false,
          diabetes: false,
          ets: false,
          otros: false,
        });
        setOtrasEnfermedadesDetalle('');
        setEnTratamiento(false);
      }
    } else if (field === 'noTieneEnfermedades') {
      setNoTieneEnfermedades(event.target.checked);
      if (event.target.checked) {
        setTieneEnfermedades(false);
        // Resetear selecciones y detalles si se marca 'No'
        setEnfermedadesSeleccionadas({
          cardiovasculares: false,
          diabetes: false,
          ets: false,
          otros: false,
        });
        setOtrasEnfermedadesDetalle('');
        setEnTratamiento(false);
      }
    }
  };

  const handleEnfermedadSelection = (event) => {
    setEnfermedadesSeleccionadas({
      ...enfermedadesSeleccionadas,
      [event.target.name]: event.target.checked,
    });
  };

  const handleApreciacionGeneralChange = (event) => {
    setApreciacionGeneral({
      ...apreciacionGeneral,
      [event.target.name]: event.target.checked,
    });
  };

  const handleExamenRegionalChange = (event) => {
    const { name, checked } = event.target;
    setExamenRegional({
      ...examenRegional,
      [name]: checked,
    });
    if (!checked && examenRegionalDetalles[name] !== undefined) {
      setExamenRegionalDetalles((prevDetails) => ({
        ...prevDetails,
        [name]: '',
      }));
    }
  };

  const handleExamenRegionalDetalleChange = (event) => {
    setExamenRegionalDetalles({
      ...examenRegionalDetalles,
      [event.target.name]: event.target.value,
    });
  };

  const handleContinenteAlteracionesChange = (event) => {
    const { checked } = event.target;
    setContinenteAlteraciones(checked);
    if (!checked) {
      setContinenteOpciones({
        esfinterOralAnterior: false,
        mejillas: false,
        paladar: false,
        pisoDeBoca: false,
        esfinterOralPosterior: false,
      });
      setContinenteDetalles({
        esfinterOralAnterior: '',
        mejillas: '',
        paladar: '',
        pisoDeBoca: '',
        esfinterOralPosterior: '',
      });
    }
  };

  const handleContinenteOpcionesChange = (event) => {
    const { name, checked } = event.target;
    setContinenteOpciones({
      ...continenteOpciones,
      [name]: checked,
    });
    if (!checked) {
      setContinenteDetalles((prevDetails) => ({
        ...prevDetails,
        [name]: '',
      }));
    }
  };

  const handleContinenteDetalleChange = (event) => {
    setContinenteDetalles({
      ...continenteDetalles,
      [event.target.name]: event.target.value,
    });
  };

  const handleContenidoAlteracionesChange = (event) => {
    const { checked } = event.target;
    setContenidoAlteraciones(checked);
    if (!checked) {
      setContenidoOpciones({
        lenguaDorso: false,
        lenguaVientre: false,
        lenguaBordes: false,
        lenguaFrenillo: false,
        saliva: false,
        rebordesResiduales: false,
        bridasyFrenillos: false,
      });
      setContenidoDetalles({
        lenguaDorso: '',
        lenguaVientre: '',
        lenguaBordes: '',
        lenguaFrenillo: '',
        saliva: '',
        rebordesResiduales: '',
        bridasyFrenillos: '',
      });
    }
  };

  const handleContenidoOpcionesChange = (event) => {
    const { name, checked } = event.target;
    setContenidoOpciones({
      ...contenidoOpciones,
      [name]: checked,
    });
    if (!checked) {
      setContenidoDetalles((prevDetails) => ({
        ...prevDetails,
        [name]: '',
      }));
    }
  };

  const handleContenidoDetalleChange = (event) => {
    setContenidoDetalles({
      ...contenidoDetalles,
      [event.target.name]: event.target.value,
    });
  };

  const handleInputChange = (field, value) => {
    console.log(`Actualizando campo ${field} con valor:`, value);
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      console.log('Nuevo formData:', newData);
      return newData;
    });
  };

  const handleCancel = () => {
    setShowConfirmModal(true);
  };

  const confirmCancel = () => {
    navigate(-1);
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000); // Aumentado a 5 segundos para mejor visibilidad
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!paciente || !paciente.id) {
      showNotification('error', 'No se pudo obtener el ID del paciente. Por favor, recargue la página.');
      setLoading(false);
      return;
    }

    // Construir enfermedades actuales basado en las selecciones
    let enfermedadesActuales = '';
    if (tieneEnfermedades) {
      const enfermedades = [];
      if (enfermedadesSeleccionadas.cardiovasculares) enfermedades.push('Cardiovasculares');
      if (enfermedadesSeleccionadas.diabetes) enfermedades.push('Diabetes');
      if (enfermedadesSeleccionadas.ets) enfermedades.push('ETS');
      if (enfermedadesSeleccionadas.otros && otrasEnfermedadesDetalle) {
        enfermedades.push(`Otros: ${otrasEnfermedadesDetalle}`);
      }
      enfermedadesActuales = enfermedades.join(', ');
    }

    // Construir medicamentos
    let medicamentos = '';
    if (tomaMedicamentos) {
      medicamentos = formData.medicamentos || 'Medicamentos especificados';
    }

    // Construir alergias
    let alergiasTexto = '';
    if (alergias) {
      alergiasTexto = formData.alergiasDetalle || 'Alergias especificadas';
    }

    // Construir apreciación general
    let apreciacionGeneralTexto = '';
    const apreciaciones = [];
    if (apreciacionGeneral.lucido) apreciaciones.push('Lúcido');
    if (apreciacionGeneral.apiretico) apreciaciones.push('Apirético');
    if (apreciacionGeneral.colaborador) apreciaciones.push('Colaborador');
    if (apreciacionGeneral.ambulatorio) apreciaciones.push('Ambulatorio');
    apreciacionGeneralTexto = apreciaciones.join(', ');

    // Construir examen regional
    let examenRegionalTexto = '';
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
    examenRegionalTexto = examenesRegionales.join(', ');

    // Construir examen local
    let examenLocalTexto = '';
    if (continenteAlteraciones) {
      const continenteItems = [];
      if (continenteOpciones.esfinterOralAnterior) continenteItems.push('Esfínter oral anterior');
      if (continenteOpciones.mejillas) continenteItems.push('Mejillas');
      if (continenteOpciones.paladar) continenteItems.push('Paladar');
      if (continenteOpciones.pisoDeBoca) continenteItems.push('Piso de boca');
      if (continenteOpciones.esfinterOralPosterior) continenteItems.push('Esfínter oral posterior');
      examenLocalTexto = `Continente alterado: ${continenteItems.join(', ')}`;
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
      enfermedadesActuales: enfermedadesActuales,
      medicamentos: medicamentos,
      alergias: alergiasTexto,
      posologia: formData.posologia,
      antecedentesFamiliares: formData.antecedentesFamiliares,
      enTratamiento: enTratamiento,
      tomaBifosfonatos: tomaBifosfonatos,
      apreciacionGeneral: apreciacionGeneralTexto,
      apreciacionGeneralDetalle: formData.apreciacionGeneralDetalle,
      examenRegional: examenRegionalTexto,
      examenRegionalDetalle: formData.examenRegionalDetalle,
      examenLocal: examenLocalTexto,
      examenLocalDetalle: formData.examenLocalDetalle,
      examenRegionalDetalles: examenRegionalDetalles,
      continenteDetalles: continenteDetalles,
      fumador: fumador,
      consumeCafe: consumeCafe,
      consumeTe: consumeTe,
      consumeMate: consumeMate,
      consumeAlcohol: consumeAlcohol,
      consumeDrogas: consumeDrogas,
      usuario: { id: 1 } // Asegúrate de que este ID de usuario exista en tu DB
    };

    // Debug: Mostrar los datos que se van a enviar
    console.log('=== DATOS DEL FORMULARIO ===');
    console.log('formData completo:', formData);
    console.log('Datos a enviar al servidor:', historiaClinicaData);
    console.log('=== FIN DEBUG ===');

    try {
      let response;
      if (historiaClinicaId) {
        // PUT (actualizar)
        response = await axios.put(`http://localhost:8080/api/historia-clinica/${historiaClinicaId}`, historiaClinicaData);
      } else {
        // POST (crear)
        response = await axios.post('http://localhost:8080/api/historia-clinica', historiaClinicaData);
      }
      showNotification('success', '¡Historia clínica guardada con éxito!');
      if (response.data.fecha) {
        setFechaUltimaActualizacion(response.data.fecha);
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      const errorMessage = error.response?.data?.message || 'Error al guardar la historia clínica';
      showNotification('error', `Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !paciente) return <p>Cargando...</p>;
  if (error) return <div className="error-message">{error}</div>;
  if (!paciente) return <p>No se encontró el paciente</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <MessageDisplay message={displayMessage} type={messageType} onDismiss={handleDismissMessage} />
            
            {/* Notificación */}
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
                    <h4 className="enfermedades-title">¿Tiene enfermedades?</h4>
                    <div className="enfermedades-grid">
                      <div className="enfermedades-item">
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