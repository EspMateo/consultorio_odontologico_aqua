import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { buildApiUrl } from '../../config';
import { OdontogramShell, getStatusChart, importStatus } from 'react-advanced-odontogram';
import 'react-advanced-odontogram/style.css';
import './Odontograma.css';

const AQUA_THEME = {
  colors: {
    accent: '#06b6d4',
    accent2: '#0891b2',
  },
};

const Odontograma = () => {
  const { id } = useParams();
  const location = useLocation();

  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [observaciones, setObservaciones] = useState('');

  // El motor de react-advanced-odontogram vive fuera de React (singleton a
  // nivel de módulo); guardamos el payload guardado y lo hidratamos recién
  // cuando OdontogramShell ya está montado.
  const initialStatusRef = useRef(null);
  const hydratedRef = useRef(false);

  useEffect(() => {
    hydratedRef.current = false;

    const fetchPacienteData = async () => {
      try {
        let pacienteData;
        if (location.state?.paciente) {
          pacienteData = location.state.paciente;
        } else {
          const response = await axios.get(buildApiUrl(`pacientes/${id}`));
          pacienteData = response.data;
        }

        setPaciente({
          id: pacienteData.id,
          nombre: `${pacienteData.name} ${pacienteData.lastname}`,
        });

        await cargarOdontogramaMasReciente(pacienteData.id);
      } catch (error) {
        setMessage('Error al cargar los datos del paciente');
      } finally {
        setLoading(false);
      }
    };

    fetchPacienteData();
  }, [id, location.state]);

  const cargarOdontogramaMasReciente = async (pacienteId) => {
    try {
      const response = await axios.get(buildApiUrl(`odontogramas/paciente/${pacienteId}/reciente`));
      const odontograma = response.data;

      setObservaciones(odontograma?.observaciones || '');

      if (odontograma?.datosDientes) {
        try {
          initialStatusRef.current = JSON.parse(odontograma.datosDientes);
        } catch (parseError) {
          initialStatusRef.current = null;
        }
      } else {
        initialStatusRef.current = null;
      }
    } catch (error) {
      // Sin odontograma guardado todavía: no es un error, se parte en blanco.
      initialStatusRef.current = null;
      setObservaciones('');
    }
  };

  // Hidratar el editor con los datos guardados una vez que ya está montado.
  useEffect(() => {
    if (loading || hydratedRef.current || !initialStatusRef.current) return;
    hydratedRef.current = true;
    importStatus(initialStatusRef.current);
  }, [loading]);

  const handleSaveChanges = async () => {
    if (!paciente?.id) {
      setMessage('Error: No se pudo identificar al paciente');
      return;
    }

    setSaving(true);
    try {
      const statusChart = getStatusChart();

      await axios.post(buildApiUrl('odontogramas'), {
        pacienteId: paciente.id,
        tipoDenticion: 'permanente',
        datosDientes: statusChart,
        observaciones: observaciones || 'Odontograma actualizado',
      });

      setMessage('Odontograma guardado exitosamente');
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage('Error al guardar el odontograma: ' + (error.response?.data || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleRecargarOdontograma = async () => {
    if (!paciente?.id) {
      setMessage('Error: No se pudo identificar al paciente');
      return;
    }

    setLoading(true);
    try {
      await cargarOdontogramaMasReciente(paciente.id);
      hydratedRef.current = false;
      setMessage('Odontograma recargado exitosamente');
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage('Error al recargar el odontograma');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="odontograma-loading">
        <div className="spinner"></div>
        <p>Cargando odontograma...</p>
      </div>
    );
  }

  return (
    <div className="odontograma-page">
      <div className="odontograma-page-header">
        <h1>Odontograma{paciente ? ` — ${paciente.nombre}` : ''}</h1>
      </div>

      <div className="odontograma-shell-wrapper">
        <OdontogramShell
          language="es"
          numberingSystem="FDI"
          darkMode={false}
          themeConfig={AQUA_THEME}
          enableNotes
        />
      </div>

      <div className="odontograma-section">
        <div className="observaciones-panel">
          <h3>Observaciones</h3>
          <textarea
            value={observaciones}
            onChange={(e) => {
              setObservaciones(e.target.value);
              setMessage(null);
            }}
            placeholder="Agregar observaciones sobre el odontograma..."
            rows="3"
            className="observaciones-textarea"
          />
        </div>
      </div>

      <div className="odontograma-section">
        <div className="acciones-panel">
          <h3>Acciones</h3>
          <div className="acciones-buttons">
            <button
              className="btn-guardar"
              onClick={handleSaveChanges}
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
              className="btn-icon-text"
              onClick={handleRecargarOdontograma}
              type="button"
            >
              ⟳ Recargar
            </button>
            <button
              className="btn-volver"
              onClick={() => window.history.back()}
            >
              Volver
            </button>
          </div>
          {message && (
            <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Odontograma;
