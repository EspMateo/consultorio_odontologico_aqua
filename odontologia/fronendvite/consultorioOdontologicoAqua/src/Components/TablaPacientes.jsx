import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../config';
import MessageDisplay from './MessageDisplay';
import './styles/TablaPacientes.css';

function TablaPacientes({ usuarioId }) {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayMessage, setDisplayMessage] = useState(null);
  const [messageType, setMessageType] = useState('info');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPacientes();
  }, []);

  const fetchPacientes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(buildApiUrl('pacientes'), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setPacientes(response.data);
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
      setDisplayMessage('Error al cargar los pacientes');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(buildApiUrl('pacientes/buscar'), {
        params: {
          nombre: searchTerm || null,
          apellido: searchTerm || null,
          cedula: searchTerm || null,
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setPacientes(response.data);
      if (response.data.length === 0) {
        setDisplayMessage('No se encontraron pacientes con los criterios de búsqueda.');
        setMessageType('info');
      } else {
        setDisplayMessage(`Se encontraron ${response.data.length} pacientes.`);
        setMessageType('success');
      }
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      setDisplayMessage('Error al buscar pacientes.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Está seguro que desea eliminar este paciente? Esta acción no se puede deshacer.');
    
    if (confirmDelete) {
      setDeletingId(id);
      try {
        await axios.delete(buildApiUrl(`pacientes/${id}`), {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setPacientes(pacientes.filter(p => p.id !== id));
        setDisplayMessage('Paciente eliminado exitosamente.');
        setMessageType('success');
      } catch (error) {
        console.error('Error al eliminar paciente:', error);
        let errorMessage = 'Error al eliminar el paciente.';
        
        if (error.response) {
          switch (error.response.status) {
            case 404:
              errorMessage = 'El paciente no fue encontrado.';
              break;
            case 403:
              errorMessage = 'No tiene permisos para eliminar este paciente.';
              break;
            default:
              errorMessage = error.response.data?.message || errorMessage;
          }
        }
        
        setDisplayMessage(errorMessage);
        setMessageType('error');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleEdit = (paciente) => {
    navigate(`/dashboard/pacientes/editar/${paciente.id}`, { state: { paciente } });
  };

  const handleHistoriaClinica = (paciente) => {
    navigate(`/dashboard/pacientes/historia-clinica/${paciente.id}`, { state: { paciente } });
  };

  const handleOdontograma = (paciente) => {
    navigate(`/dashboard/pacientes/odontograma/${paciente.id}`, { state: { paciente } });
  };

  const handlePeriodontograma = (paciente) => {
    navigate(`/dashboard/pacientes/periodontograma/${paciente.id}`, { state: { paciente } });
  };

  const handleDismissMessage = () => {
    setDisplayMessage(null);
    setMessageType('info');
  };

  if (loading) return <p>Cargando pacientes...</p>;

  return (
    <div className="tabla-container">
      <MessageDisplay message={displayMessage} type={messageType} onDismiss={handleDismissMessage} />
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar paciente por nombre, apellido o cédula..."
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Buscar
        </button>
      </div>

      <table className="tabla-pacientes">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Cédula</th>
            <th>Fecha</th>
            <th>Consulta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.length === 0 ? (
            <tr>
              <td colSpan="6">No hay pacientes registrados.</td>
            </tr>
          ) : (
            pacientes.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.lastname}</td>
                <td>{p.ci}</td>
                <td>{p.releaseSummary}</td>
                <td>{p.diagnosis}</td>
                <td className="acciones-cell">
                  <button 
                    onClick={() => handleHistoriaClinica(p)}
                    className="btn-historia"
                  >
                    Historia Clínica
                  </button>
                  <button 
                    onClick={() => handleOdontograma(p)}
                    className="btn-odontograma"
                  >
                    Odontograma
                  </button>
                  <button 
                    onClick={() => handlePeriodontograma(p)}
                    className="btn-periodontograma"
                  >
                    Periodontograma
                  </button>
                  <button 
                    onClick={() => handleEdit(p)}
                    className="btn-editar"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    className="btn-eliminar"
                    disabled={deletingId === p.id}
                  >
                    {deletingId === p.id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TablaPacientes; 