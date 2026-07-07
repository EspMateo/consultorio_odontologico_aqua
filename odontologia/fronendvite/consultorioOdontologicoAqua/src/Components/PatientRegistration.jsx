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
    hora: '',
    tipoConsulta: '',
    sexo: '',
    edad: ''
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
  
  // Estados para mensajes del modal
  const [modalMessage, setModalMessage] = useState(null);
  const [modalMessageType, setModalMessageType] = useState('success');
  
  // Estados para validación de cédula duplicada
  const [cedulaDuplicada, setCedulaDuplicada] = useState(false);
  const [pacienteExistente, setPacienteExistente] = useState(null);

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

  // Efecto para revalidar la cédula cuando cambie la lista de pacientes
  useEffect(() => {
    // Solo validar si ya se ha intentado enviar el formulario
    // No validar en tiempo real
  }, [pacientes, formData.cedula]);

  useEffect(() => {
    // Actualizar citas de hoy cuando cambien los eventos
    const hoy = new Date().toISOString().split('T')[0];
    const citasHoyFiltradas = events.filter(event => {
      const eventDate = event.start.split('T')[0];
      return eventDate === hoy;
    });
    
    // Ordenar citas por horario (de menor a mayor)
    const citasOrdenadas = citasHoyFiltradas.sort((a, b) => {
      const horaA = new Date(a.start).getTime();
      const horaB = new Date(b.start).getTime();
      return horaA - horaB;
    });
    
    setCitasHoy(citasOrdenadas);
  }, [events]);

  const fetchPacientes = async () => {
    try {
      const response = await axios.get(buildApiUrl('pacientes'));
      
      const pacientesData = Array.isArray(response.data)
        ? response.data
        : (typeof response.data === 'string'
            ? JSON.parse(response.data)
            : []);
      
      // Verificar si hay cédulas duplicadas en los datos recibidos
      const cedulas = pacientesData.map(p => p.ci).filter(ci => ci != null);
      const cedulasUnicas = new Set(cedulas);
      if (cedulas.length !== cedulasUnicas.size) {
        const duplicados = cedulas.filter(ci => {
          const count = cedulas.filter(c => c === ci).length;
          return count > 1;
        });
      }
      
      setPacientes(pacientesData);
    } catch (error) {
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
      // Error silencioso para citas
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
    setModalMessage(null); // Limpiar mensajes anteriores del modal
    setAgendaFormData(prev => ({
      ...prev,
      fecha: selectedDate || new Date().toISOString().split('T')[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar cédula duplicada solo al enviar
    if (formData.cedula && formData.cedula.length >= 7) {
      const pacienteExistenteInicial = pacientes.find(paciente => 
        paciente.ci && paciente.ci.toString() === formData.cedula
      );
      
      if (pacienteExistenteInicial) {
        setCedulaDuplicada(true);
        setPacienteExistente(pacienteExistenteInicial);
        // NO mostrar mensaje aquí, solo establecer el estado
        return;
      } else {
        setCedulaDuplicada(false);
        setPacienteExistente(null);
      }
    }
    

    
    // Verificación inmediata del estado de validación
    if (cedulaDuplicada) {
      // NO mostrar mensaje aquí, solo retornar
      return;
    }
    
    // Verificación adicional: si el formulario está deshabilitado, no permitir envío
    if (e.target.querySelector('fieldset')?.disabled) {
      showMessage('El formulario está deshabilitado debido a una cédula duplicada', 'error');
      return;
    }
    
    // Validaciones del lado del cliente
    if (!formData.cedula || formData.cedula.length < 7) {
      showMessage('La cédula debe tener al menos 7 dígitos', 'error');
      return;
    }
    
    if (!formData.numero || formData.numero.length < 7) {
      showMessage('El número de celular debe tener al menos 7 dígitos', 'error');
      return;
    }
    
    if (!formData.nombre.trim() || !formData.apellido.trim()) {
      showMessage('El nombre y apellido son obligatorios', 'error');
      return;
    }
    
    // Validar que nombre y apellido no contengan números
    if (formData.nombre.match(/\d/)) {
      showMessage('El nombre no puede contener números', 'error');
      return;
    }
    
    if (formData.apellido.match(/\d/)) {
      showMessage('El apellido no puede contener números', 'error');
      return;
    }
    
    // Validar que la fecha no sea mayor a 2027
    if (formData.fecha) {
      const fechaSeleccionada = new Date(formData.fecha);
      const fechaLimite = new Date('2027-12-31');
      
      if (fechaSeleccionada > fechaLimite) {
        showMessage('La fecha no puede ser mayor al año 2027', 'error');
        return;
      }
    }
    
    // Verificar si ya existe un paciente con la misma cédula
    const pacienteExistenteValidacion = pacientes.find(paciente => 
      paciente.ci && paciente.ci.toString() === formData.cedula
    );
    
    if (pacienteExistenteValidacion) {
      showMessage(`Ya existe un paciente con la cédula ${formData.cedula}: ${pacienteExistenteValidacion.name} ${pacienteExistenteValidacion.lastname}. Por favor, verifique los datos.`, 'error');
      return;
    }
    
    // Verificación adicional: si el estado de validación indica duplicado, no permitir envío
    if (cedulaDuplicada && pacienteExistente) {
      showMessage(`Ya existe un paciente con la cédula ${formData.cedula}: ${pacienteExistente.name} ${pacienteExistente.lastname}. Por favor, verifique los datos.`, 'error');
      return;
    }
    
    // Verificación final de seguridad: buscar en la lista actual de pacientes
    const pacienteExistenteFinal = pacientes.find(paciente => 
      paciente.ci && paciente.ci.toString() === formData.cedula
    );
    
    if (pacienteExistenteFinal) {
      showMessage(`Error de validación: Ya existe un paciente con la cédula ${formData.cedula}: ${pacienteExistenteFinal.name} ${pacienteExistenteFinal.lastname}.`, 'error');
      return;
    }
    
    // Verificación adicional: asegurar que la lista de pacientes esté actualizada
    if (pacientes.length === 0) {
      await fetchPacientes();
      
      // Verificar nuevamente después de recargar
      const pacienteExistenteRecargado = pacientes.find(paciente => 
        paciente.ci && paciente.ci.toString() === formData.cedula
      );
      
      if (pacienteExistenteRecargado) {
        showMessage(`Error de validación: Ya existe un paciente con la cédula ${formData.cedula}: ${pacienteExistenteRecargado.name} ${pacienteExistenteRecargado.lastname}.`, 'error');
        return;
      }
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(buildApiUrl('pacientes'), formData);
      
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
          hora: '',
          tipoConsulta: '',
          sexo: '',
          edad: ''
        });
        // Limpiar estados de validación
        setCedulaDuplicada(false);
        setPacienteExistente(null);
        showMessage('Paciente registrado exitosamente');
        
        // Actualizar la lista de pacientes inmediatamente
        await fetchPacientes();
        
        // Verificar que la cédula no esté duplicada después de la actualización
                 if (response.data.ci) {
           const pacienteExistente = pacientes.find(paciente => 
             paciente.ci === response.data.ci
           );
         }
      }
    } catch (error) {
      // Manejar específicamente el error de cédula duplicada
      if (error.response?.status === 409 || error.response?.data?.message?.includes('cédula') || error.response?.data?.message?.includes('cedula')) {
        showMessage('Ya existe un paciente con esa cédula. Por favor, verifique los datos.', 'error');
             } else {
         setError(error.response?.data?.message || 'Error al registrar el paciente');
         showMessage('Error al registrar el paciente', 'error');
       }
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
      
      // NO cerrar el modal automáticamente
      // setShowModal(false);
      
      // Actualizar las citas
      fetchAppointments();
      
      // Limpiar el formulario
      setAgendaFormData({
        pacienteId: '',
        fecha: '',
        hora: '',
        motivo: ''
      });
      
      // Mostrar mensaje de éxito dentro del modal
      setModalMessage('Cita agendada exitosamente');
      setModalMessageType('success');
      
         } catch (error) {
       // Mostrar mensaje de error dentro del modal
       setModalMessage('Error al crear la cita. Por favor, intente nuevamente.');
       setModalMessageType('error');
     }
  };

  const handleEditCita = (cita) => {
    setCitaToEdit(cita);
    setModalMessage(null); // Limpiar mensajes anteriores del modal
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
      
      // NO cerrar el modal automáticamente
      // setShowEditModal(false);
      // setCitaToEdit(null);
      
      // Actualizar las citas
      fetchAppointments();
      
      // Limpiar el formulario
      setEditFormData({
        pacienteId: '',
        fecha: '',
        hora: '',
        motivo: ''
      });
      
      // Mostrar mensaje de éxito dentro del modal
      setModalMessage('Cita actualizada exitosamente');
      setModalMessageType('success');
      
         } catch (error) {
       // Mostrar mensaje de error dentro del modal
       setModalMessage('Error al actualizar la cita. Por favor, intente nuevamente.');
       setModalMessageType('error');
     }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validaciones específicas por campo
    let validatedValue = value;
    
    if (name === 'cedula') {
      // Solo permitir números para cédula
      validatedValue = value.replace(/[^0-9]/g, '');
    } else if (name === 'numero') {
      // Solo permitir números para celular
      validatedValue = value.replace(/[^0-9]/g, '');
    } else if (name === 'nombre' || name === 'apellido') {
      // No permitir números en nombre y apellido
      validatedValue = value.replace(/[0-9]/g, '');
    } else if (name === 'edad') {
      // Solo permitir números para edad, máximo 3 dígitos
      validatedValue = value.replace(/[^0-9]/g, '').slice(0, 3);
      // Limitar edad a 150 años
      if (parseInt(validatedValue) > 150) {
        validatedValue = '150';
      }
    }
    
    setFormData(prevState => ({
      ...prevState,
      [name]: validatedValue
    }));
    
    // NO validar cédula duplicada en tiempo real
    // Solo limpiar el estado de error si se cambia la cédula
    if (name === 'cedula') {
      // Limpiar el estado de error cuando se cambia la cédula
      setCedulaDuplicada(false);
      setPacienteExistente(null);
    }
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
    setModalMessage(null); // Limpiar mensajes del modal
    setEditFormData({
      pacienteId: '',
      fecha: '',
      hora: '',
      motivo: ''
    });
  };

  return (
    <div className="main-container">
      {/* Eliminar mensajes que aparecen arriba a la derecha */}
      {/* {message && (
        <div className={`message ${messageType}`}>
          {message}
          <button onClick={() => setMessage(null)}>×</button>
        </div>
      )} */}

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
         <div className={`citas-hoy-section ${citasHoy.length >= 3 ? 'has-many-citas' : ''}`}>
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
          </div>
          
          {/* Mostrar mensajes de éxito y error en la sección del formulario */}
          {message && (
            <div className={`form-message ${messageType}`}>
              {messageType === 'success' ? '✅ ' : '❌ '}
              {message}
            </div>
          )}
          
          {/* Eliminar el mensaje de error rojo de arriba */}
          {/* {error && <div className="error-message">{error}</div>} */}
          {/* Eliminar el mensaje de validación rojo de arriba */}
          {/* {cedulaDuplicada && (
            <div className="form-validation-alert">
              ⚠️ <strong>No se puede registrar:</strong> Ya existe un paciente con la cédula {formData.cedula}
            </div>
          )} */}
          
          <form onSubmit={handleSubmit} className="patient-form">
            {/* Eliminar el fieldset disabled para que el formulario no se bloquee */}
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
                  <input 
                    type="text" 
                    name="cedula" 
                    value={formData.cedula} 
                    onChange={handleChange} 
                    className={`patient-form-input ${cedulaDuplicada ? 'input-error' : ''}`}
                    maxLength="10"
                    required 
                  />
                  {cedulaDuplicada && pacienteExistente && (
                    <div className="cedula-warning">
                      ⚠️ Ya existe un paciente con la cédula {formData.cedula}: <strong>{pacienteExistente.name} {pacienteExistente.lastname}</strong>
                    </div>
                  )}
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
                <div className="patient-form-group">
                  <label className="patient-form-label">Edad</label>
                  <input 
                    type="number" 
                    name="edad" 
                    value={formData.edad} 
                    onChange={handleChange} 
                    className="patient-form-input" 
                    min="0" 
                    max="150" 
                    placeholder="Opcional"
                  />
                </div>
              </div>
            </div>
            
            <div className="patient-form-section">
              <h3 className="patient-form-section-title">Información de Contacto</h3>
              <div className="patient-form-row">
                <div className="patient-form-group">
                  <label className="patient-form-label">Número de Teléfono</label>
                  <input 
                    type="tel" 
                    name="numero" 
                    value={formData.numero} 
                    onChange={handleChange} 
                    className="patient-form-input" 
                    maxLength="10"
                    required 
                  />
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
                    <option value="urgencia">Urgencia</option>
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
                className={`patient-form-button ${cedulaDuplicada ? 'button-disabled' : ''}`}
                disabled={loading || cedulaDuplicada}
                title={cedulaDuplicada ? 'No se puede registrar: Cédula duplicada' : ''}
              >
                {loading ? 'Registrando...' : cedulaDuplicada ? 'Cédula Duplicada' : 'Registrar Paciente'}
              </button>
              
              {cedulaDuplicada && (
                <div className="form-help-text">
                  <small>Para continuar, cambie la cédula por una que no esté registrada</small>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Modal para Agendar Cita */}
      {showModal && (
        <div className="modal-overlay">
          <div className={`modal-content ${modalMessage ? 'has-message' : ''}`}>
            <h2>Nueva Cita</h2>
            
            {/* Mostrar mensaje dentro del modal */}
            {modalMessage && (
              <div className={`modal-message ${modalMessageType}`}>
                <div className={`modal-message-icon ${modalMessageType}`}></div>
                {modalMessage}
              </div>
            )}
            
            {/* Mostrar formulario solo si no hay mensaje de éxito */}
            {!modalMessage || modalMessageType === 'error' ? (
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
                    required
                    placeholder="Ingrese el motivo de la cita"
                    onChange={handleAgendaChange}
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-primary">Guardar</button>
                  <button type="button" className="btn-secondary" onClick={() => {
                    setShowModal(false);
                    setModalMessage(null);
                  }}>
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              /* Mostrar botones después del éxito */
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={() => {
                    setShowModal(false);
                    setModalMessage(null);
                  }}
                >
                  Cerrar
                </button>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => {
                    setModalMessage(null);
                    setAgendaFormData({
                      pacienteId: '',
                      fecha: selectedDate || new Date().toISOString().split('T')[0],
                      hora: '',
                      motivo: ''
                    });
                  }}
                >
                  Agregar Otra Cita
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal para Editar Cita */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className={`modal-content ${modalMessage ? 'has-message' : ''}`}>
            <h2>Editar Cita</h2>
            
            {/* Mostrar mensaje dentro del modal */}
            {modalMessage && (
              <div className={`modal-message ${modalMessageType}`}>
                <div className={`modal-message-icon ${modalMessageType}`}></div>
                {modalMessage}
              </div>
            )}
            
                        {/* Mostrar formulario solo si no hay mensaje de éxito */}
            {!modalMessage || modalMessageType === 'error' ? (
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
            ) : (
              /* Mostrar botones después del éxito */
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={() => {
                    setShowEditModal(false);
                    setCitaToEdit(null);
                    setModalMessage(null);
                  }}
                >
                  Cerrar
                </button>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => {
                    setModalMessage(null);
                    setEditFormData({
                      pacienteId: '',
                      fecha: '',
                      hora: '',
                      motivo: ''
                    });
                  }}
                >
                  Editar Otra Cita
                </button>
              </div>
            )}
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