import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { buildApiUrl } from '../../config';
import './ControlFinanciero.css';

const ControlFinanciero = () => {
  // Estados principales
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Estados para filtros
  const [filtroTipo, setFiltroTipo] = useState('mes');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Estados para datos
  const [gastos, setGastos] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [resumen, setResumen] = useState({
    totalIngresos: 0,
    totalGastos: 0,
    totalPendientes: 0,
    balance: 0
  });

  // Estados para formularios
  const [showGastoForm, setShowGastoForm] = useState(false);
  const [nuevoGasto, setNuevoGasto] = useState({
    descripcion: '',
    precio: '',
    cantidad: 1,
    fechaGasto: '',
    categoria: '',
    proveedor: '',
    observaciones: ''
  });

  // Establecer fechas por defecto (mes actual) y cargar datos inmediatamente
  useEffect(() => {
    const establecerFechasPorDefecto = () => {
      const hoy = new Date();
      const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
      
      const fechaInicioStr = primerDiaMes.toISOString().split('T')[0];
      const fechaFinStr = ultimoDiaMes.toISOString().split('T')[0];
      
      setFechaInicio(fechaInicioStr);
      setFechaFin(fechaFinStr);
      
      // Cargar datos inmediatamente después de establecer las fechas
      cargarDatos(fechaInicioStr, fechaFinStr);
    };

    establecerFechasPorDefecto();
  }, []); // Solo se ejecuta una vez al montar el componente

  // Cargar datos cuando cambian las fechas (solo si ya están establecidas)
  useEffect(() => {
    if (fechaInicio && fechaFin && fechaInicio !== '' && fechaFin !== '') {
      cargarDatos(fechaInicio, fechaFin);
    }
  }, [fechaInicio, fechaFin]);

  // Calcular resumen cuando cambian los datos
  useEffect(() => {
    calcularResumen();
  }, [gastos, ingresos]);

  const cargarDatos = async (fechaInicioParam = fechaInicio, fechaFinParam = fechaFin) => {
    if (!fechaInicioParam || !fechaFinParam) return;
    
    setLoading(true);
    try {
      await Promise.all([
        cargarGastos(fechaInicioParam, fechaFinParam),
        cargarIngresos(fechaInicioParam, fechaFinParam),
        cargarCategorias()
      ]);
    } catch (error) {
      setMessage('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const cargarGastos = async (fechaInicioParam, fechaFinParam) => {
    try {
      const response = await axios.get(buildApiUrl(`gastos/por-fecha?fechaInicio=${fechaInicioParam}&fechaFin=${fechaFinParam}`));
      setGastos(response.data);
    } catch (error) {
      setGastos([]);
    }
  };

  const cargarIngresos = async (fechaInicioParam, fechaFinParam) => {
    try {
      const presupuestosResponse = await axios.get(buildApiUrl(`presupuesto/por-fecha?fechaInicio=${fechaInicioParam}&fechaFin=${fechaFinParam}`));
      setIngresos(presupuestosResponse.data);
    } catch (error) {
      setIngresos([]);
    }
  };

  const cargarCategorias = async () => {
    try {
      const response = await axios.get(buildApiUrl('gastos/categorias'));
      setCategorias(response.data);
    } catch (error) {
    }
  };

  const calcularResumen = () => {
    const totalGastos = gastos.reduce((sum, gasto) => sum + parseFloat(gasto.total || 0), 0);
    const totalIngresos = ingresos.reduce((sum, presupuesto) => {
      return sum + presupuesto.tratamientos.reduce((sumTrat, tratamiento) => 
        sumTrat + parseFloat(tratamiento.abonado || 0), 0);
    }, 0);
    const totalPendientes = ingresos.reduce((sum, presupuesto) => {
      return sum + presupuesto.tratamientos.reduce((sumTrat, tratamiento) => 
        sumTrat + (parseFloat(tratamiento.precio || 0) - parseFloat(tratamiento.abonado || 0)), 0);
    }, 0);

    setResumen({
      totalIngresos,
      totalGastos,
      totalPendientes,
      balance: totalIngresos - totalGastos
    });
  };

  const handleCrearGasto = async () => {
    // Validar campos obligatorios
    if (!nuevoGasto.descripcion || !nuevoGasto.precio) {
      setMessage('Por favor complete los campos obligatorios (Descripción y Precio)');
      return;
    }

    try {
      setFormLoading(true);
      const gastoData = {
        ...nuevoGasto,
        precio: parseFloat(nuevoGasto.precio),
        cantidad: parseInt(nuevoGasto.cantidad)
      };

      await axios.post(buildApiUrl('gastos'), gastoData);
      
      // Limpiar formulario
      setNuevoGasto({
        descripcion: '',
        precio: '',
        cantidad: 1,
        fechaGasto: new Date().toISOString().split('T')[0],
        categoria: '',
        proveedor: '',
        observaciones: ''
      });
      
      setShowGastoForm(false);
      setMessage('Gasto registrado exitosamente');
      
      // Recargar datos
      await cargarDatos();
    } catch (error) {
      setMessage('Error al registrar el gasto');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEliminarGasto = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este gasto?')) {
      try {
        setLoading(true);
        await axios.delete(buildApiUrl(`gastos/${id}`));
        setMessage('Gasto eliminado exitosamente');
        await cargarDatos();
      } catch (error) {
        setMessage('Error al eliminar el gasto');
      } finally {
        setLoading(false);
      }
    }
  };

  const aplicarFiltro = (tipo) => {
    setFiltroTipo(tipo);
    const hoy = new Date();
    let nuevaFechaInicio, nuevaFechaFin;

    switch (tipo) {
      case 'hoy':
        nuevaFechaInicio = nuevaFechaFin = hoy.toISOString().split('T')[0];
        break;
      case 'semana':
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - hoy.getDay());
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(inicioSemana.getDate() + 6);
        nuevaFechaInicio = inicioSemana.toISOString().split('T')[0];
        nuevaFechaFin = finSemana.toISOString().split('T')[0];
        break;
      case 'mes':
        nuevaFechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split('T')[0];
        nuevaFechaFin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).toISOString().split('T')[0];
        break;
      default:
        return;
    }

    setFechaInicio(nuevaFechaInicio);
    setFechaFin(nuevaFechaFin);
  };

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(valor);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO');
  };

  const handleCancelarGasto = () => {
    setShowGastoForm(false);
    setNuevoGasto({
      descripcion: '',
      precio: '',
      cantidad: 1,
      fechaGasto: new Date().toISOString().split('T')[0],
      categoria: '',
      proveedor: '',
      observaciones: ''
    });
  };

  return (
    <div className="control-financiero-container">
      <div className="control-financiero-header">
        <h1>Control Financiero</h1>
        <p>Gestión y seguimiento de ingresos y gastos</p>
      </div>

      {/* Filtros de fecha */}
      <div className="filtros-container">
        <div className="filtros-rapidos">
          <button 
            className={`filtro-btn ${filtroTipo === 'hoy' ? 'active' : ''}`}
            onClick={() => aplicarFiltro('hoy')}
          >
            Hoy
          </button>
          <button 
            className={`filtro-btn ${filtroTipo === 'semana' ? 'active' : ''}`}
            onClick={() => aplicarFiltro('semana')}
          >
            Esta Semana
          </button>
          <button 
            className={`filtro-btn ${filtroTipo === 'mes' ? 'active' : ''}`}
            onClick={() => aplicarFiltro('mes')}
          >
            Este Mes
          </button>
        </div>
        
        <div className="filtros-personalizados">
          <div className="fecha-input">
            <label>Desde:</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div className="fecha-input">
            <label>Hasta:</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Resumen compacto */}
      <div className="resumen-compacto">
        <div className="resumen-item">
          <span className="resumen-label">Ingresos</span>
          <span className="resumen-valor positivo">{formatearMoneda(resumen.totalIngresos)}</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-label">Gastos</span>
          <span className="resumen-valor negativo">{formatearMoneda(resumen.totalGastos)}</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-label">Pendientes</span>
          <span className="resumen-valor">{formatearMoneda(resumen.totalPendientes)}</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-label">Balance</span>
          <span className={`resumen-valor ${resumen.balance >= 0 ? 'positivo' : 'negativo'}`}>
            {formatearMoneda(resumen.balance)}
          </span>
        </div>
      </div>

      {/* Vista de Resumen General */}
      <div className="resumen-section">
        <div className="section-header">
          <h2>Resumen Financiero</h2>
          <div className="header-actions">
            <span className="periodo">Período: {formatearFecha(fechaInicio)} - {formatearFecha(fechaFin)}</span>
            <button 
              className="btn-agregar"
              onClick={() => setShowGastoForm(true)}
            >
              + Registrar Gasto
            </button>
          </div>
        </div>

        <div className="resumen-tables">
          <div className="table-section">
            <h3>Últimos Ingresos</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Paciente</th>
                    <th>Fecha</th>
                    <th>Tratamiento</th>
                    <th>Precio</th>
                    <th>Abonado</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {ingresos.slice(0, 5).map((presupuesto) => 
                    presupuesto.tratamientos?.map((tratamiento, index) => (
                      <tr key={`${presupuesto.id}-${index}`}>
                        <td>{presupuesto.pacienteNombre} {presupuesto.pacienteApellido}</td>
                        <td>{formatearFecha(presupuesto.fechaRegistro)}</td>
                        <td>{tratamiento.nombre}</td>
                        <td>{formatearMoneda(tratamiento.precio)}</td>
                        <td>{formatearMoneda(tratamiento.abonado)}</td>
                        <td>
                          <span className={`estado-badge ${tratamiento.pagado ? 'pagado' : 'pendiente'}`}>
                            {tratamiento.pagado ? 'Pagado' : 'Pendiente'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="table-section">
            <h3>Últimos Gastos</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th>Fecha</th>
                    <th>Categoría</th>
                    <th>Proveedor</th>
                    <th>Total</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {gastos.slice(0, 5).map((gasto) => (
                    <tr key={gasto.id}>
                      <td>{gasto.descripcion}</td>
                      <td>{formatearFecha(gasto.fechaGasto)}</td>
                      <td>{gasto.categoria}</td>
                      <td>{gasto.proveedor}</td>
                      <td>{formatearMoneda(gasto.total)}</td>
                      <td>
                        <button 
                          className="btn-eliminar-small"
                          onClick={() => handleEliminarGasto(gasto.id)}
                          title="Eliminar gasto"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para nuevo gasto */}
      {showGastoForm && (
        <div className="gasto-modal-overlay">
          <div className="gasto-modal">
            <div className="gasto-modal-header">
              <h3>Registrar Nuevo Gasto</h3>
              <button className="btn-cerrar" onClick={handleCancelarGasto}>
                ×
              </button>
            </div>

            <div className="gasto-modal-content">
              <div className="form-grid">
                <div className="form-group">
                  <label>Descripción:</label>
                  <input
                    type="text"
                    value={nuevoGasto.descripcion}
                    onChange={(e) => setNuevoGasto({...nuevoGasto, descripcion: e.target.value})}
                    placeholder="Descripción del gasto"
                  />
                </div>
                <div className="form-group">
                  <label>Precio:</label>
                  <input
                    type="number"
                    value={nuevoGasto.precio}
                    onChange={(e) => setNuevoGasto({...nuevoGasto, precio: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label>Cantidad:</label>
                  <input
                    type="number"
                    value={nuevoGasto.cantidad}
                    onChange={(e) => setNuevoGasto({...nuevoGasto, cantidad: e.target.value})}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Fecha:</label>
                  <input
                    type="date"
                    value={nuevoGasto.fechaGasto}
                    onChange={(e) => setNuevoGasto({...nuevoGasto, fechaGasto: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Categoría:</label>
                  <select
                    value={nuevoGasto.categoria}
                    onChange={(e) => setNuevoGasto({...nuevoGasto, categoria: e.target.value})}
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="Materiales">Materiales</option>
                    <option value="Equipos">Equipos</option>
                    <option value="Suministros">Suministros</option>
                    <option value="Servicios">Servicios</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Proveedor:</label>
                  <input
                    type="text"
                    value={nuevoGasto.proveedor}
                    onChange={(e) => setNuevoGasto({...nuevoGasto, proveedor: e.target.value})}
                    placeholder="Nombre del proveedor"
                  />
                </div>
              </div>
              <div className="form-group full-width">
                <label>Observaciones:</label>
                <textarea
                  value={nuevoGasto.observaciones}
                  onChange={(e) => setNuevoGasto({...nuevoGasto, observaciones: e.target.value})}
                  placeholder="Observaciones adicionales..."
                />
              </div>
              <div className="form-actions">
                <button 
                  className="btn-cancelar"
                  onClick={handleCancelarGasto}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-guardar"
                  onClick={handleCrearGasto}
                  disabled={formLoading}
                >
                  {formLoading ? 'Guardando...' : 'Registrar Gasto'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mensajes */}
      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
          <button onClick={() => setMessage(null)}>×</button>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loader">Cargando...</div>
        </div>
      )}
    </div>
  );
};

export default ControlFinanciero; 