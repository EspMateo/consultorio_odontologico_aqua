import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import './PatientRegistration.css';

const steps = [
  { key: 'personal', label: 'Información Personal' },
  { key: 'contacto', label: 'Información de Contacto' },
  { key: 'consulta', label: 'Información de la Consulta' },
];

const PatientRegistration = () => {
  // Estados para el formulario de registro de pacientes
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    numero: '',
    direccion: '',
    consulta: '',
    fecha: '',
    sexo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Estados para el calendario y agenda
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCitasModal, setShowCitasModal] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [citasDelDia, setCitasDelDia] = useState([]);
  const [citasHoy, setCitasHoy] = useState([]);
  const [agendaFormData, setAgendaFormData] = useState({
    pacienteId: '',
    fecha: '',
    hora: '',
    motivo: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchPacientes();
  }, []);

  useEffect(() => {
    // Actualizar citas de hoy cuando cambien los eventos
    const hoy = new Date().toISOString().split('T')[0];
    const citasHoyFiltradas = events.filter(event => {
      const eventDate = event.start.split('T')[0];
      return eventDate === hoy;
    });
    setCitasHoy(citasHoyFiltradas);
  }, [events]);

  const fetchPacientes = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/pacientes');
      setPacientes(response.data);
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      alert('Error al cargar la lista de pacientes');
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/citas');
      const formattedEvents = response.data.map(cita => ({
        id: cita.id,
        title: `${cita.paciente.name} ${cita.paciente.lastname} - CI: ${cita.paciente.ci}`,
        start: `${cita.fecha}T${cita.hora}`,
        description: cita.motivo
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error al obtener citas:', error);
    }
  };

  const handleDateClick = (clickInfo) => {
    const clickedDate = clickInfo.dateStr;
    setSelectedDate(clickedDate);
    
    // Filtrar citas del día seleccionado
    const citasFiltradas = events.filter(event => {
      const eventDate = event.start.split('T')[0];
      return eventDate === clickedDate;
    });
    
    setCitasDelDia(citasFiltradas);
    setShowCitasModal(true);
  };

  const handleAgendarCitaClick = () => {
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:8080/api/pacientes/registro', formData);
      
      if (response.data) {
        // Limpiar el formulario después de un registro exitoso
        setFormData({
          nombre: '',
          apellido: '',
          cedula: '',
          numero: '',
          direccion: '',
          consulta: '',
          fecha: '',
          sexo: ''
        });
        alert('Paciente registrado exitosamente');
        // Actualizar la lista de pacientes
        fetchPacientes();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al registrar el paciente');
      alert('Error al registrar el paciente');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgendaSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const selectedPaciente = pacientes.find(p => p.id === parseInt(agendaFormData.pacienteId));
      
      const citaData = {
        paciente: {
          id: selectedPaciente.id
        },
        fecha: agendaFormData.fecha,
        hora: agendaFormData.hora,
        motivo: agendaFormData.motivo,
        usuarioId: parseInt(userId)
      };

      await axios.post('http://localhost:8080/api/citas', citaData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setShowModal(false);
      fetchAppointments();
      setAgendaFormData({
        pacienteId: '',
        fecha: '',
        hora: '',
        motivo: ''
      });
      alert('Cita agendada exitosamente');
    } catch (error) {
      console.error('Error al crear la cita:', error);
      alert('Error al crear la cita. Por favor, intente nuevamente.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAgendaChange = (e) => {
    const { name, value } = e.target;
    setAgendaFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="main-container">
      {/* Sección del Calendario */}
      <div className="calendar-section">
        <div className="calendar-header">
          <h2>Calendario de Citas</h2>
          <button 
            className="agendar-cita-btn"
            onClick={handleAgendarCitaClick}
          >
            Agendar Cita
          </button>
        </div>
        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek,dayGridDay'
            }}
            selectable={false}
            dayMaxEvents={true}
            weekends={true}
            events={events}
            dateClick={handleDateClick}
            locale="es"
            buttonText={{
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día'
            }}
            allDayText="Todo el día"
            noEventsText="No hay eventos"
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false,
              hour12: false
            }}
            titleFormat={{
              month: 'long',
              year: 'numeric'
            }}
          />
        </div>
        
        {/* Sección de Citas de Hoy */}
        <div className="citas-hoy-section">
          <h3>Citas de Hoy</h3>
          {citasHoy.length > 0 ? (
            <div className="citas-hoy-list">
              {citasHoy.map((cita, index) => (
                <div key={index} className="cita-hoy-item">
                  <div className="cita-hora">{cita.start.split('T')[1]}</div>
                  <div className="cita-info">
                    <h4>{cita.title}</h4>
                    <p>{cita.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-citas-hoy">No hay citas programadas para hoy</p>
          )}
        </div>
      </div>

      {/* Sección del Formulario de Registro */}
      <div className="form-section">
        <div className="patient-form-card">
          <div className="patient-form-header">
            <h2 className="patient-form-title">Registro de Paciente</h2>
            <p className="patient-form-subtitle">Complete el formulario con los datos del paciente</p>
          </div>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="patient-form">
            <div className="patient-form-section">
              <h3 className="patient-form-section-title">Información Personal</h3>
              <div className="patient-form-row">
                <div className="patient-form-group">
                  <label className="patient-form-label">Nombre</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="patient-form-input" required />
                </div>
                <div className="patient-form-group">
                  <label className="patient-form-label">Apellido</label>
                  <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} className="patient-form-input" required />
                </div>
                <div className="patient-form-group">
                  <label className="patient-form-label">Sexo</label>
                  <select name="sexo" value={formData.sexo} onChange={handleChange} className="patient-form-input" required>
                    <option value="">Seleccione...</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="patient-form-section">
              <h3 className="patient-form-section-title">Información de Contacto</h3>
              <div className="patient-form-row">
                <div className="patient-form-group">
                  <label className="patient-form-label">Cédula</label>
                  <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} className="patient-form-input" required />
                </div>
                <div className="patient-form-group">
                  <label className="patient-form-label">Número de Teléfono</label>
                  <input type="tel" name="numero" value={formData.numero} onChange={handleChange} className="patient-form-input" required />
                </div>
                <div className="patient-form-group patient-form-group-full">
                  <label className="patient-form-label">Dirección</label>
                  <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} className="patient-form-input" required />
                </div>
              </div>
            </div>
            <div className="patient-form-section">
              <h3 className="patient-form-section-title">Información de la Consulta</h3>
              <div className="patient-form-row">
                <div className="patient-form-group">
                  <label className="patient-form-label">Fecha</label>
                  <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} className="patient-form-input" required />
                </div>
                <div className="patient-form-group patient-form-group-full">
                  <label className="patient-form-label">Consulta</label>
                  <textarea name="consulta" value={formData.consulta} onChange={handleChange} rows="4" className="patient-form-input" required></textarea>
                </div>
              </div>
            </div>
            <div className="patient-form-actions">
              <button 
                type="submit" 
                className="patient-form-button"
                disabled={loading}
              >
                {loading ? 'Registrando...' : 'Registrar Paciente'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal para Agendar Cita */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Nueva Cita</h2>
            <form onSubmit={handleAgendaSubmit}>
              <div className="form-group">
                <label>Paciente:</label>
                <select
                  value={agendaFormData.pacienteId}
                  onChange={handleAgendaChange}
                  name="pacienteId"
                  required
                  className="form-select"
                >
                  <option value="">Seleccione un paciente</option>
                  {pacientes.map(paciente => (
                    <option key={paciente.id} value={paciente.id}>
                      {paciente.name} {paciente.lastname} - CI: {paciente.ci}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Fecha:</label>
                <input
                  type="date"
                  name="fecha"
                  value={agendaFormData.fecha}
                  onChange={handleAgendaChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Hora:</label>
                <input
                  type="time"
                  name="hora"
                  value={agendaFormData.hora}
                  onChange={handleAgendaChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Motivo:</label>
                <textarea
                  name="motivo"
                  value={agendaFormData.motivo}
                  onChange={handleAgendaChange}
                  required
                  placeholder="Ingrese el motivo de la cita"
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Guardar</button>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para mostrar citas del día */}
      {showCitasModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Citas del {selectedDate}</h2>
            {citasDelDia.length > 0 ? (
              <div className="citas-list">
                {citasDelDia.map((cita, index) => (
                  <div key={index} className="cita-item">
                    <h4>{cita.title}</h4>
                    <p><strong>Hora:</strong> {cita.start.split('T')[1]}</p>
                    <p><strong>Motivo:</strong> {cita.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay citas programadas para este día.</p>
            )}
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-primary"
                onClick={() => {
                  setAgendaFormData(prev => ({ ...prev, fecha: selectedDate }));
                  setShowCitasModal(false);
                  setShowModal(true);
                }}
              >
                Agendar Nueva Cita
              </button>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setShowCitasModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRegistration; 