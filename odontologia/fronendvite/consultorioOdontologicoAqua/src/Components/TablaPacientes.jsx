import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/TablaPacientes.css';

function TablaPacientes({ usuarioId }) {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8080/api/pacientes`)
      .then(res => setPacientes(res.data))
      .catch(err => {
        setPacientes([]);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando pacientes...</p>;

  return (
    <div className="tabla-container">
      <table className="tabla-pacientes">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cédula</th>
            <th>Fecha</th>
            <th>Consulta</th>
            <th>Odontólogo</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.length === 0 ? (
            <tr>
              <td colSpan="5">No hay pacientes registrados.</td>
            </tr>
          ) : (
            pacientes.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.ci}</td>
                <td>{p.releaseSummary}</td>
                <td>{p.diagnosis}</td>
                <td>{/* Odontólogo - falta definir cómo obtenerlo */}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TablaPacientes; 