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

  useEffect(() => {
    if (location.state?.paciente) {
      setPaciente(location.state.paciente);
      setLoading(false);
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

  if (loading) return <p>Cargando...</p>;
  if (error) return <div className="error-message">{error}</div>;
  if (!paciente) return <p>No se encontró el paciente</p>;

  return (
    <div className="historia-clinica-container">
      <MessageDisplay message={displayMessage} type={messageType} onDismiss={handleDismissMessage} />
      <div className="historia-clinica-card">
        <div className="historia-clinica-header">
          <h2 className="historia-clinica-title">Historia Clínica</h2>
          <p className="historia-clinica-subtitle">
            {paciente.name} {paciente.lastname} - CI: {paciente.ci}
          </p>
        </div>

        <div className="historia-clinica-section">
          <h3 className="historia-clinica-section-title">Información Personal</h3>
          <div className="historia-clinica-grid">
            <div className="historia-clinica-item">
              <label>Cédula:</label>
              <span>{paciente.ci}</span>
            </div>
            <div className="historia-clinica-item">
              <label>Sexo:</label>
              <span>{paciente.gender}</span>
            </div>
          </div>
        </div>

        <div className="historia-clinica-section">
          <h3 className="historia-clinica-section-title">Información de Contacto</h3>
          <div className="historia-clinica-grid">
            <div className="historia-clinica-item">
              <label>Teléfono:</label>
              <span>{paciente.telephone}</span>
            </div>
            <div className="historia-clinica-item full-width">
              <label htmlFor="motivoConsulta">Motivo de consulta:</label>
              <textarea
                id="motivoConsulta"
                name="motivoConsulta"
                rows="3"
                placeholder="Describa el motivo de la consulta"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="historia-clinica-section">
          <h3 className="historia-clinica-section-title">Hábitos</h3>
          <div className="historia-clinica-grid">
            <div className="historia-clinica-item full-width">
              <h4>De higiene:</h4>
            </div>
            <div className="historia-clinica-item">
              <label htmlFor="cepilladoDental">Cepillado dental: (Indicar valor diario)</label>
              <input
                type="number"
                id="cepilladoDental"
                name="cepilladoDental"
                placeholder="2"
              />
            </div>
            <div className="historia-clinica-item">
              <label htmlFor="cepilladoEncias">Cepillado de encías: (Indicar valor diario)</label>
              <input
                type="number"
                id="cepilladoEncias"
                name="cepilladoEncias"
                placeholder="2"
              />
            </div>
            <div className="historia-clinica-item">
              <label htmlFor="cepilladoLingual">Cepillado lingual: (Indicar valor diario)</label>
              <input
                type="number"
                id="cepilladoLingual"
                name="cepilladoLingual"
                placeholder="2"
              />
            </div>
            <div className="historia-clinica-item">
              <label>
                <input
                  type="checkbox"
                  name="usaHiloDental"
                  checked={usaHiloDental}
                  onChange={handleCheckboxChange(setUsaHiloDental)}
                />
                Usa Hilo dental
              </label>
              {usaHiloDental && (
                <div style={{ display: 'inline-block', marginLeft: '10px' }}>
                  <label htmlFor="hiloDentalVeces">Veces: </label>
                  <input
                    type="number"
                    id="hiloDentalVeces"
                    name="hiloDentalVeces"
                    placeholder="2"
                    style={{ width: '50px' }}
                  />
                </div>
              )}
            </div>
            <div className="historia-clinica-item full-width">
              <label>
                <input
                  type="checkbox"
                  name="higieneProtesica"
                  checked={higieneProtesica}
                  onChange={handleCheckboxChange(setHigieneProtesica)}
                />
                Higiene protésica
              </label>
            </div>
            <div className="historia-clinica-item full-width">
              <label htmlFor="obsHigienica">Observaciones Higiénicas:</label>
              <textarea
                id="obsHigienica"
                name="obsHigienica"
                rows="2"
                placeholder="Campo para observaciones de higiene o cualquier dato adicional"
              ></textarea>
            </div>
            <div className="historia-clinica-item full-width">
              <label>
                <input
                  type="checkbox"
                  name="consumeDrogas"
                  checked={consumeDrogas}
                  onChange={handleCheckboxChange(setConsumeDrogas)}
                />
                Consume drogas
              </label>
            </div>
            {consumeDrogas && (
              <div className="historia-clinica-item full-width">
                <label htmlFor="drogasDetalle">Detalle (si consume drogas):</label>
                <textarea
                  id="drogasDetalle"
                  name="drogasDetalle"
                  rows="2"
                  placeholder="Especifique el tipo de drogas y frecuencia"
                ></textarea>
              </div>
            )}
            <div className="historia-clinica-item full-width">
              <label>Consumo de:</label>
              <label>
                <input
                  type="checkbox"
                  name="consumeTe"
                  checked={consumeTe}
                  onChange={handleCheckboxChange(setConsumeTe)}
                />
                Té
              </label>
              <label>
                <input
                  type="checkbox"
                  name="consumeCafe"
                  checked={consumeCafe}
                  onChange={handleCheckboxChange(setConsumeCafe)}
                />
                Café
              </label>
              <label>
                <input
                  type="checkbox"
                  name="consumeMate"
                  checked={consumeMate}
                  onChange={handleCheckboxChange(setConsumeMate)}
                />
                Mate
              </label>
            </div>
            {(consumeTe || consumeCafe || consumeMate) && (
              <div className="historia-clinica-item full-width">
                <label htmlFor="frecuenciaBebidas">Frecuencia de consumo:</label>
                <textarea
                  id="frecuenciaBebidas"
                  name="frecuenciaBebidas"
                  rows="2"
                  placeholder="Ej: Café, 2 tazas al día"
                ></textarea>
              </div>
            )}
            <div className="historia-clinica-item full-width">
              <label>
                <input
                  type="checkbox"
                  name="dietaCariogenica"
                  checked={dietaCariogenica}
                  onChange={handleCheckboxChange(setDietaCariogenica)}
                />
                Dieta cariogénica
              </label>
            </div>
          </div>
        </div>

        <div className="historia-clinica-section">
          <h3 className="historia-clinica-section-title">Antecedentes Médicos</h3>
          <div className="historia-clinica-grid">
            <div className="historia-clinica-item full-width">
              <label>¿Tiene enfermedades?</label>
              <label style={{ marginLeft: '10px' }}>
                <input
                  type="checkbox"
                  name="tieneEnfermedades"
                  checked={tieneEnfermedades}
                  onChange={handleTieneEnfermedadesChange('tieneEnfermedades')}
                />
                Sí
              </label>
              <label style={{ marginLeft: '20px' }}>
                <input
                  type="checkbox"
                  name="noTieneEnfermedades"
                  checked={noTieneEnfermedades}
                  onChange={handleTieneEnfermedadesChange('noTieneEnfermedades')}
                />
                No
              </label>
            </div>
            {tieneEnfermedades && (
              <>
                <div className="historia-clinica-item full-width">
                  <h4>Lista de Enfermedades:</h4>
                  <label>
                    <input
                      type="checkbox"
                      name="cardiovasculares"
                      checked={enfermedadesSeleccionadas.cardiovasculares}
                      onChange={handleEnfermedadSelection}
                    />
                    Cardiovasculares
                  </label>
                  <label style={{ marginLeft: '10px' }}>
                    <input
                      type="checkbox"
                      name="diabetes"
                      checked={enfermedadesSeleccionadas.diabetes}
                      onChange={handleEnfermedadSelection}
                    />
                    Diabetes
                  </label>
                  <label style={{ marginLeft: '10px' }}>
                    <input
                      type="checkbox"
                      name="ets"
                      checked={enfermedadesSeleccionadas.ets}
                      onChange={handleEnfermedadSelection}
                    />
                    ETS
                  </label>
                  <label style={{ marginLeft: '10px' }}>
                    <input
                      type="checkbox"
                      name="otros"
                      checked={enfermedadesSeleccionadas.otros}
                      onChange={handleEnfermedadSelection}
                    />
                    Otros
                  </label>
                </div>
                {enfermedadesSeleccionadas.otros && (
                  <div className="historia-clinica-item full-width">
                    <label htmlFor="otrasEnfermedadesDetalle">Especificar Otras Enfermedades:</label>
                    <textarea
                      id="otrasEnfermedadesDetalle"
                      name="otrasEnfermedadesDetalle"
                      rows="2"
                      placeholder="Especifique las otras enfermedades"
                      value={otrasEnfermedadesDetalle}
                      onChange={(e) => setOtrasEnfermedadesDetalle(e.target.value)}
                    ></textarea>
                  </div>
                )}
                <div className="historia-clinica-item full-width">
                  <label>
                    <input
                      type="checkbox"
                      name="enTratamiento"
                      checked={enTratamiento}
                      onChange={handleCheckboxChange(setEnTratamiento)}
                    />
                    Está en tratamiento
                  </label>
                </div>
              </>
            )}
            <div className="historia-clinica-item full-width">
              <label>
                <input
                  type="checkbox"
                  name="alergias"
                  checked={alergias}
                  onChange={handleCheckboxChange(setAlergias)}
                />
                Alergias
              </label>
            </div>
            {alergias && (
              <div className="historia-clinica-item full-width">
                <label htmlFor="alergiasDetalle">Especificar Alergias:</label>
                <textarea
                  id="alergiasDetalle"
                  name="alergiasDetalle"
                  rows="2"
                  placeholder="Detalle las alergias"
                ></textarea>
              </div>
            )}
            <div className="historia-clinica-item full-width">
              <label>
                <input
                  type="checkbox"
                  name="tomaMedicamentos"
                  checked={tomaMedicamentos}
                  onChange={handleMedicacionChange('tomaMedicamentos')}
                />
                Toma medicaciones
              </label>
              <label style={{ marginLeft: '20px' }}>
                <input
                  type="checkbox"
                  name="noTomaMedicamentos"
                  checked={noTomaMedicamentos}
                  onChange={handleMedicacionChange('noTomaMedicamentos')}
                />
                No toma medicaciones
              </label>
            </div>
            {tomaMedicamentos && (
              <>
                <div className="historia-clinica-item full-width">
                  <label htmlFor="medicamentos">Medicamentos que toma:</label>
                  <textarea
                    id="medicamentos"
                    name="medicamentos"
                    rows="2"
                    placeholder="Liste los medicamentos"
                  ></textarea>
                </div>
                <div className="historia-clinica-item full-width">
                  <label htmlFor="posologia">Posología y Comentarios:</label>
                  <textarea
                    id="posologia"
                    name="posologia"
                    rows="2"
                    placeholder="Detalle la posología y otros comentarios relevantes"
                  ></textarea>
                </div>
                <div className="historia-clinica-item full-width">
                  <label>
                    <input
                      type="checkbox"
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
          <h3 className="historia-clinica-section-title">Apreciación General/Examen Clínico</h3>
          <div className="historia-clinica-grid">
            <div className="historia-clinica-item">
              <h4>Apreciación General:</h4>
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
                Apírético
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

            <div className="historia-clinica-item">
              <h4>Examen Regional:</h4>
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
                  rows="1"
                  placeholder="Detalle aquí"
                  value={examenRegionalDetalles.facies}
                  onChange={handleExamenRegionalDetalleChange}
                ></textarea>
              )}
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
                  rows="1"
                  placeholder="Detalle aquí"
                  value={examenRegionalDetalles.cuello}
                  onChange={handleExamenRegionalDetalleChange}
                ></textarea>
              )}
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
                  rows="1"
                  placeholder="Detalle aquí"
                  value={examenRegionalDetalles.ganglios}
                  onChange={handleExamenRegionalDetalleChange}
                ></textarea>
              )}
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
                  rows="1"
                  placeholder="Detalle aquí"
                  value={examenRegionalDetalles.atm}
                  onChange={handleExamenRegionalDetalleChange}
                ></textarea>
              )}
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
                  rows="1"
                  placeholder="Detalle aquí"
                  value={examenRegionalDetalles.macizoFacial}
                  onChange={handleExamenRegionalDetalleChange}
                ></textarea>
              )}
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
                  rows="1"
                  placeholder="Detalle aquí"
                  value={examenRegionalDetalles.mandibula}
                  onChange={handleExamenRegionalDetalleChange}
                ></textarea>
              )}
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
                  rows="1"
                  placeholder="Detalle aquí"
                  value={examenRegionalDetalles.musculos}
                  onChange={handleExamenRegionalDetalleChange}
                ></textarea>
              )}
              <label>
                <input
                  type="checkbox"
                  name="meso"
                  checked={examenRegional.meso}
                  onChange={handleExamenRegionalChange}
                />
                Meso
              </label>
              <label>
                <input
                  type="checkbox"
                  name="dolico"
                  checked={examenRegional.dolico}
                  onChange={handleExamenRegionalChange}
                />
                Dólico
              </label>
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

            <div className="historia-clinica-item">
              <h4>Examen Local:</h4>
              <div>
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
                        rows="1"
                        placeholder="Detalle"
                        value={continenteDetalles.esfinterOralAnterior}
                        onChange={handleContinenteDetalleChange}
                      ></textarea>
                    )}
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
                        rows="1"
                        placeholder="Detalle"
                        value={continenteDetalles.mejillas}
                        onChange={handleContinenteDetalleChange}
                      ></textarea>
                    )}
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
                        rows="1"
                        placeholder="Detalle"
                        value={continenteDetalles.paladar}
                        onChange={handleContinenteDetalleChange}
                      ></textarea>
                    )}
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
                        rows="1"
                        placeholder="Detalle"
                        value={continenteDetalles.pisoDeBoca}
                        onChange={handleContinenteDetalleChange}
                      ></textarea>
                    )}
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
                        rows="1"
                        placeholder="Detalle"
                        value={continenteDetalles.esfinterOralPosterior}
                        onChange={handleContinenteDetalleChange}
                      ></textarea>
                    )}
                  </div>
                )}
              </div>
              <div style={{ marginTop: '10px' }}>
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
                    <label>
                      <input
                        type="checkbox"
                        name="lenguaDorso"
                        checked={contenidoOpciones.lenguaDorso}
                        onChange={handleContenidoOpcionesChange}
                      />
                      Lengua: Dorso
                    </label>
                    {contenidoOpciones.lenguaDorso && (
                      <textarea
                        name="lenguaDorso"
                        rows="1"
                        placeholder="Detalle"
                        value={contenidoDetalles.lenguaDorso}
                        onChange={handleContenidoDetalleChange}
                      ></textarea>
                    )}
                    <label>
                      <input
                        type="checkbox"
                        name="lenguaVientre"
                        checked={contenidoOpciones.lenguaVientre}
                        onChange={handleContenidoOpcionesChange}
                      />
                      Lengua: Vientre
                    </label>
                    {contenidoOpciones.lenguaVientre && (
                      <textarea
                        name="lenguaVientre"
                        rows="1"
                        placeholder="Detalle"
                        value={contenidoDetalles.lenguaVientre}
                        onChange={handleContenidoDetalleChange}
                      ></textarea>
                    )}
                    <label>
                      <input
                        type="checkbox"
                        name="lenguaBordes"
                        checked={contenidoOpciones.lenguaBordes}
                        onChange={handleContenidoOpcionesChange}
                      />
                      Lengua: Bordes
                    </label>
                    {contenidoOpciones.lenguaBordes && (
                      <textarea
                        name="lenguaBordes"
                        rows="1"
                        placeholder="Detalle"
                        value={contenidoDetalles.lenguaBordes}
                        onChange={handleContenidoDetalleChange}
                      ></textarea>
                    )}
                    <label>
                      <input
                        type="checkbox"
                        name="lenguaFrenillo"
                        checked={contenidoOpciones.lenguaFrenillo}
                        onChange={handleContenidoOpcionesChange}
                      />
                      Lengua: Frenillo
                    </label>
                    {contenidoOpciones.lenguaFrenillo && (
                      <textarea
                        name="lenguaFrenillo"
                        rows="1"
                        placeholder="Detalle"
                        value={contenidoDetalles.lenguaFrenillo}
                        onChange={handleContenidoDetalleChange}
                      ></textarea>
                    )}
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
                        rows="1"
                        placeholder="Detalle"
                        value={contenidoDetalles.saliva}
                        onChange={handleContenidoDetalleChange}
                      ></textarea>
                    )}
                    <label>
                      <input
                        type="checkbox"
                        name="rebordesResiduales"
                        checked={contenidoOpciones.rebordesResiduales}
                        onChange={handleContenidoOpcionesChange}
                      />
                      Rebordes Residuales
                    </label>
                    {contenidoOpciones.rebordesResiduales && (
                      <textarea
                        name="rebordesResiduales"
                        rows="1"
                        placeholder="Detalle"
                        value={contenidoDetalles.rebordesResiduales}
                        onChange={handleContenidoDetalleChange}
                      ></textarea>
                    )}
                    <label>
                      <input
                        type="checkbox"
                        name="bridasyFrenillos"
                        checked={contenidoOpciones.bridasyFrenillos}
                        onChange={handleContenidoOpcionesChange}
                      />
                      Bridas y Frenillos
                    </label>
                    {contenidoOpciones.bridasyFrenillos && (
                      <textarea
                        name="bridasyFrenillos"
                        rows="1"
                        placeholder="Detalle"
                        value={contenidoDetalles.bridasyFrenillos}
                        onChange={handleContenidoDetalleChange}
                      ></textarea>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="historia-clinica-actions">
          <button
            className="historia-clinica-button historia-clinica-button-secondary"
            onClick={() => navigate('/dashboard/pacientes')}
          >
            Volver a la lista de pacientes
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoriaClinica; 