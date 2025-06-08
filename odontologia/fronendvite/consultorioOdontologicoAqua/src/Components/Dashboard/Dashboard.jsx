import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import '../styles/Dashboard.css';
import Loader from '../Loader';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('inicio');
  const [loading, setLoading] = useState(false);
  const userEmail = localStorage.getItem('userEmail');
  const userId = localStorage.getItem('userId');

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('token');
      navigate('/');
    }, 1000);
  };

  const menuItems = [
    { id: 'inicio', label: 'Inicio', path: '' }, // Ruta por defecto para /dashboard
    { id: 'pacientes', label: 'Pacientes', path: 'pacientes' },
    { id: 'agenda', label: 'Agenda', path: 'agenda' },
    { id: 'tratamientos', label: 'Tratamientos', path: 'tratamientos' },
    { id: 'reportes', label: 'Reportes', path: 'reportes' },
  ];

  // Determinar la pestaña activa basada en la ruta actual
  React.useEffect(() => {
    const path = location.pathname;
    if (path.includes('/dashboard/pacientes')) {
      setActiveTab('pacientes');
    } else if (path.includes('/dashboard/agenda')) {
      setActiveTab('agenda');
    } else if (path === '/dashboard' || path === '/dashboard/') {
      setActiveTab('inicio');
    }
    // Puedes añadir más lógica para otras pestañas si es necesario
  }, [location.pathname]);

  return (
    <div className="dashboard-container">
      {loading ? (
        <div className="fullscreen-loader">
          <Loader mensaje="Cerrando sesión..." />
        </div>
      ) : (
        <>
          <header className="dashboard-header">
            <div className="header-left">
              <h1 className="app-title">Consultorio Odontológico</h1>
            </div>
            <div className="user-info">
              <span className="welcome-text">Bienvenido,</span>
              <span className="user-name">{userEmail}</span>
              <button className="logout-button" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          </header>

          <nav className="dashboard-nav">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  navigate(`/dashboard/${item.path}`);
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <main className="dashboard-content">
            <Outlet /> {/* Aquí se renderizarán los componentes de las rutas anidadas */}
          </main>
        </>
      )}
    </div>
  );
};

export default Dashboard; 