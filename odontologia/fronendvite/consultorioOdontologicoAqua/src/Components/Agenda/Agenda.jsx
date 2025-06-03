import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import './Agenda.css';

const Agenda = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [formData, setFormData] = useState({
    pacienteId: '',
    fecha: '',
    hora: '',
    motivo: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchPacientes();
  }, []);

  const formatCI = (ci) => {
    if (!ci) return 'No disponible';
    return ci.toString();
  };

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
        title: `${cita.paciente.name} ${cita.paciente.lastname}`,
        start: `${cita.fecha}T${cita.hora}`,
        description: cita.motivo
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error al obtener citas:', error);
    }
  };

  const handleDateSelect = (selectInfo) => {
    setFormData(prev => ({
      ...prev,
      fecha: selectInfo.startStr
    }));
    setShowModal(true);
  };

  const handleEventClick = (clickInfo) => {
    console.log('Evento clickeado:', clickInfo.event);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      await axios.post('http://localhost:8080/api/citas', {
        ...formData,
        usuarioId: userId
      });
      setShowModal(false);
      fetchAppointments();
      setFormData({
        pacienteId: '',
        fecha: '',
        hora: '',
        motivo: ''
      });
    } catch (error) {
      console.error('Error al crear la cita:', error);
      alert('Error al crear la cita. Por favor, intente nuevamente.');
    }
  };

  return (
    <div className="agenda-container">
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay'
          }}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
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
        />
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Nueva Cita</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Paciente:</label>
                <select
                  value={formData.pacienteId}
                  onChange={(e) => setFormData({...formData, pacienteId: e.target.value})}
                  required
                  className="form-select"
                >
                  <option value="">Seleccione un paciente</option>
                  {pacientes.map(paciente => (
                    <option key={paciente.id} value={paciente.id}>
                      {paciente.name} {paciente.lastname} - CI: {formatCI(paciente.CI)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Hora:</label>
                <input
                  type="time"
                  value={formData.hora}
                  onChange={(e) => setFormData({...formData, hora: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Motivo:</label>
                <textarea
                  value={formData.motivo}
                  onChange={(e) => setFormData({...formData, motivo: e.target.value})}
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
    </div>
  );
};

export default Agenda; 