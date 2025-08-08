import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { buildApiUrl } from '../config';
import './PatientRegistration.css';

const steps = [
  { key: 'personal', label: 'Información Personal' },
  { key: 'contacto', label: 'Información de Contacto' },
  { key: 'consulta', label: 'Información de la Consulta' },
];

// Función para generar colores por usuario
const generateUserColors = () => {
  const colors = [
    '#3b82f6', // Azul
    '#dc2626', // Rojo
    '#059669', // Verde
    '#7c3aed', // Púrpura
    '#ea580c', // Naranja
    '#be185d', // Rosa
    '#0891b2', // Cian
    '#65a30d', // Lima
    '#dc2626', // Rojo oscuro
    '#1d4ed8', // Azul oscuro
  ];
  
  const userColorMap = new Map();
  let colorIndex = 0;
  
  return (userId) => {
    if (!userColorMap.has(userId)) {
      userColorMap.set(userId, colors[colorIndex % colors.length]);
      colorIndex++;
    }
    return userColorMap.get(userId);
  };
};

const PatientRegistration = () => {
  // Función para obtener color por usuario
  const getUserColor = generateUserColors();
  
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
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [citaToDelete, setCitaToDelete] = useState(null);
  const [citaToEdit, setCitaToEdit] = useState(null);
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
  const [editFormData, setEditFormData] = useState({
    pacienteId: '',
    fecha: '',
    hora: '',
    motivo: ''
  });

  // Estados para mensajes
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  // Función para mostrar mensajes
  const showMessage = (msg, type = 'success', duration = 5000) => {
    setMessage(msg);
    setMessageType(type);
    
    if (duration > 0) {
      setTimeout(() => {
        setMessage(null);
        setMessageType('success');
      }, duration);
    }
  };

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
      const response = await axios.get(buildApiUrl('pacientes'));
      console.log('Respuesta del servidor:', response);
      console.log('Tipo de response.data:', typeof response.data);
      console.log('Es array?', Array.isArray(response.data));
      console.log('Contenido de response.data:', response.data);
      
      const pacientesData = Array.isArray(response.data)
        ? response.data
        : (typeof response.data === 'string'
            ? JSON.parse(response.data)
            : []);
      console.log('Pacientes procesados:', pacientesData);
      setPacientes(pacientesData);
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      showMessage('Error al cargar la lista de pacientes', 'error');
      // En caso de error, establecer un array vacío
      setPacientes([]);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(buildApiUrl('citas'));
      const formattedEvents = response.data.map(cita => ({
        id: cita.id,
        title: `${cita.paciente.name} ${cita.paciente.lastname} - CI: ${cita.paciente.ci}`,
        start: `${cita.fecha}T${cita.hora}`,
        description: cita.motivo,
        usuarioId: cita.usuarioId,
        usuarioName: cita.usuarioName,
        usuarioEmail: cita.usuarioEmail,
        backgroundColor: getUserColor(cita.usuarioId),
        borderColor: getUserColor(cita.usuarioId),
        textColor: '#ffffff',
        pacienteId: cita.paciente.id
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
      const response = await axios.post(buildApiUrl('pacientes/registro'), formData);
      
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
        showMessage('Paciente registrado exitosamente');
        // Actualizar la lista de pacientes
        fetchPacientes();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al registrar el paciente');
      showMessage('Error al registrar el paciente', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgendaSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const selectedPaciente = Array.isArray(pacientes) ? pacientes.find(p => p.id === parseInt(agendaFormData.pacienteId)) : null;
      
      if (!selectedPaciente) {
        showMessage('Por favor, seleccione un paciente válido', 'error');
        return;
      }
      
      const citaData = {
        paciente: {
          id: selectedPaciente.id
        },
        fecha: agendaFormData.fecha,
        hora: agendaFormData.hora,
        motivo: agendaFormData.motivo,
        usuarioId: parseInt(userId)
      };

      await axios.post(buildApiUrl('citas'), citaData, {
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
      showMessage('Cita agendada exitosamente');
    } catch (error) {
      console.error('Error al crear la cita:', error);
      showMessage('Error al crear la cita. Por favor, intente nuevamente.', 'error');
    }
  };

  const handleEditCita = (cita) => {
    setCitaToEdit(cita);
    setEditFormData({
      pacienteId: cita.pacienteId.toString(),
      fecha: cita.start.split('T')[0],
      hora: cita.start.split('T')[1],
      motivo: cita.description
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const selectedPaciente = Array.isArray(pacientes) ? pacientes.find(p => p.id === parseInt(editFormData.pacienteId)) : null;
      
      if (!selectedPaciente) {
        showMessage('Por favor, seleccione un paciente válido', 'error');
        return;
      }
      
      const citaData = {
        paciente: {
          id: selectedPaciente.id
        },
        fecha: editFormData.fecha,
        hora: editFormData.hora,
        motivo: editFormData.motivo,
        usuarioId: parseInt(userId)
      };

      await axios.put(buildApiUrl(`citas/${citaToEdit.id}`), citaData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setShowEditModal(false);
      setCitaToEdit(null);
      fetchAppointments();
      setEditFormData({
        pacienteId: '',
        fecha: '',
        hora: '',
        motivo: ''
      });
      showMessage('Cita actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
      showMessage('Error al actualizar la cita. Por favor, intente nuevamente.', 'error');
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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDeleteCita = (cita) => {
    setCitaToDelete(cita);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteCita = async () => {
    if (!citaToDelete) return;
    
    try {
      await axios.delete(buildApiUrl(`citas/${citaToDelete.id}`));
      
      // Actualizar la lista de eventos
      setEvents(prevEvents => prevEvents.filter(event => event.id !== citaToDelete.id));
      
      // Cerrar modales
      setShowDeleteConfirmModal(false);
      setShowCitasModal(false);
      setCitaToDelete(null);
      
      showMessage('Cita eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
      showMessage('Error al eliminar la cita. Por favor, intente nuevamente.', 'error');
    }
  };

  const cancelDeleteCita = () => {
    setShowDeleteConfirmModal(false);
    setCitaToDelete(null);
  };

  const cancelEditCita = () => {
    setShowEditModal(false);
    setCitaToEdit(null);
    setEditFormData({
      pacienteId: '',
      fecha: '',
      hora: '',
      motivo: ''
    });
  };

  return (
    <div className="main-container">
      {/* Mensajes */}
      {message && (
        <div className={`message ${messageType}`}>
          {message}
          <button onClick={() => setMessage(null)}>×</button>
        </div>
      )}

      {/* Sección del Calendario */}
      <div className="calendar-section">
        <div className="calendar-header">
          <h2>Calendario de Citas</h2>
          <div className="calendar-actions">
            <button 
              className="agendar-cita-btn"
              onClick={handleAgendarCitaClick}
            >
              Agendar Cita
            </button>
          </div>
        </div>
        
        {/* Leyenda de colores por doctor */}
        <div className="color-legend">
          <h4>Doctores:</h4>
          <div className="legend-items">
            {(() => {
              const uniqueUsers = new Map();
              events.forEach(event => {
                if (event.usuarioId && event.usuarioName) {
                  uniqueUsers.set(event.usuarioId, {
                    name: event.usuarioName,
                    color: event.backgroundColor
                  });
                }
              });
              
              return Array.from(uniqueUsers.values()).map((user, index) => (
                <div key={index} className="legend-item">
                  <div 
                    className="legend-color" 
                    style={{ backgroundColor: user.color }}
                  ></div>
                  <span>Dr. {user.name}</span>
                </div>
              ));
            })()}
          </div>
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
                <div 
                  key={index} 
                  className="cita-hoy-item"
                  style={{ 
                    borderLeft: `4px solid ${cita.backgroundColor || '#3b82f6'}`,
                    backgroundColor: `${cita.backgroundColor || '#3b82f6'}10`
                  }}
                >
                  <div className="cita-hora" style={{ backgroundColor: cita.backgroundColor || '#3b82f6' }}>
                    {cita.start.split('T')[1]}
                  </div>
                  <div className="cita-info">
                    <h4>{cita.title}</h4>
                    <p>{cita.description}</p>
                    <small className="cita-usuario">
                      Dr. {cita.usuarioName || 'Usuario'}
                    </small>
                  </div>
                  <div className="cita-actions">
                    <button 
                      className="edit-cita-btn"
                      onClick={() => handleEditCita(cita)}
                      title="Editar cita"
                    >
                      ✏️
                    </button>
                    <button 
                      className="delete-cita-btn"
                      onClick={() => handleDeleteCita(cita)}
                      title="Eliminar cita"
                    >
                      🗑️
                    </button>
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
                  <label className="patient-form-label">Cédula</label>
                  <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} className="patient-form-input" required />
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
                  <label className="patient-form-label">Número de Teléfono</label>
                  <input type="tel" name="numero" value={formData.numero} onChange={handleChange} className="patient-form-input" required />
                </div>
                <div className="patient-form-group">
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
                <div className="patient-form-group">
                  <label className="patient-form-label">Hora</label>
                  <input type="time" name="hora" value={formData.hora} onChange={handleChange} className="patient-form-input" required />
                </div>
                <div className="patient-form-group">
                  <label className="patient-form-label">Tipo de Consulta</label>
                  <select name="tipoConsulta" value={formData.tipoConsulta} onChange={handleChange} className="patient-form-input" required>
                    <option value="">Seleccione...</option>
                    <option value="primera_vez">Primera Vez</option>
                    <option value="control">Control</option>
                    <option value="emergencia">Emergencia</option>
                    <option value="limpieza">Limpieza</option>
                    <option value="tratamiento">Tratamiento</option>
                  </select>
                </div>
              </div>
              <div className="patient-form-row">
                <div className="patient-form-group patient-form-group-full">
                  <label className="patient-form-label">Consulta/Descripción</label>
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
                  {(() => {
                    console.log('Estado actual de pacientes:', pacientes);
                    console.log('Tipo de pacientes:', typeof pacientes);
                    console.log('Es array?', Array.isArray(pacientes));
                    return Array.isArray(pacientes) && pacientes.length > 0 ? (
                      pacientes.map(paciente => (
                        <option key={paciente.id} value={paciente.id}>
                          {paciente.name} {paciente.lastname} - CI: {paciente.ci}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No hay pacientes disponibles</option>
                    );
                  })()}
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

      {/* Modal para Editar Cita */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editar Cita</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Paciente:</label>
                <select
                  value={editFormData.pacienteId}
                  onChange={handleEditChange}
                  name="pacienteId"
                  required
                  className="form-select"
                >
                  <option value="">Seleccione un paciente</option>
                  {Array.isArray(pacientes) && pacientes.length > 0 ? (
                    pacientes.map(paciente => (
                      <option key={paciente.id} value={paciente.id}>
                        {paciente.name} {paciente.lastname} - CI: {paciente.ci}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No hay pacientes disponibles</option>
                  )}
                </select>
              </div>
              <div className="form-group">
                <label>Fecha:</label>
                <input
                  type="date"
                  name="fecha"
                  value={editFormData.fecha}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Hora:</label>
                <input
                  type="time"
                  name="hora"
                  value={editFormData.hora}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Motivo:</label>
                <textarea
                  name="motivo"
                  value={editFormData.motivo}
                  onChange={handleEditChange}
                  required
                  placeholder="Ingrese el motivo de la cita"
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Actualizar</button>
                <button type="button" className="btn-secondary" onClick={cancelEditCita}>
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
                  <div 
                    key={index} 
                    className="cita-item"
                    style={{ 
                      borderLeft: `4px solid ${cita.backgroundColor || '#3b82f6'}`,
                      backgroundColor: `${cita.backgroundColor || '#3b82f6'}10`
                    }}
                  >
                    <div className="cita-item-content">
                      <h4>{cita.title}</h4>
                      <p><strong>Hora:</strong> {cita.start.split('T')[1]}</p>
                      <p><strong>Motivo:</strong> {cita.description}</p>
                      <p><strong>Doctor:</strong> Dr. {cita.usuarioName || 'Usuario'}</p>
                    </div>
                    <div className="cita-item-actions">
                      <button 
                        className="edit-cita-btn"
                        onClick={() => handleEditCita(cita)}
                        title="Editar cita"
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-cita-btn"
                        onClick={() => handleDeleteCita(cita)}
                        title="Eliminar cita"
                      >
                        🗑️
                      </button>
                    </div>
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

      {/* Modal de confirmación para eliminar cita */}
      {showDeleteConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content delete-confirm-modal">
            <h2>Confirmar Eliminación</h2>
            <p>¿Está seguro de que desea eliminar esta cita?</p>
            {citaToDelete && (
              <div className="cita-to-delete">
                <p><strong>Paciente:</strong> {citaToDelete.title}</p>
                <p><strong>Fecha:</strong> {citaToDelete.start.split('T')[0]}</p>
                <p><strong>Hora:</strong> {citaToDelete.start.split('T')[1]}</p>
                <p><strong>Motivo:</strong> {citaToDelete.description}</p>
              </div>
            )}
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-danger"
                onClick={confirmDeleteCita}
              >
                Eliminar
              </button>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={cancelDeleteCita}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PatientRegistration;