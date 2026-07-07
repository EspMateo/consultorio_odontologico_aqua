import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import '../styles/Dashboard.css';
import Loader from '../Loader';

const ToothIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C9.5 2 7.5 3.5 6 5c-1.5 1.5-2 3-2 5 0 2.5 1 5 1.5 7 .5 2 1 4 2.5 4 1 0 1.5-.5 2-1.5.5-1 1-2 2-2s1.5 1 2 2c.5 1 1 1.5 2 1.5 1.5 0 2-2 2.5-4C19 15.5 20 13 20 10c0-2-0.5-3.5-2-5C16.5 3.5 14.5 2 12 2z"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const PatientsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

const FinanceIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
  </svg>
);

const menuItems = [
  { id: 'inicio',             label: 'Inicio',             path: '',                   icon: <HomeIcon /> },
  { id: 'pacientes',          label: 'Pacientes',          path: 'pacientes',          icon: <PatientsIcon /> },
  { id: 'control-financiero', label: 'Control Financiero', path: 'control-financiero', icon: <FinanceIcon /> },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('inicio');
  const [loading, setLoading] = useState(false);

  const userEmail = localStorage.getItem('userEmail') || '';
  const userInitial = userEmail.charAt(0).toUpperCase();

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      navigate('/');
    }, 800);
  };

  React.useEffect(() => {
    const path = location.pathname;
    if (path.includes('/dashboard/pacientes')) {
      setActiveTab('pacientes');
    } else if (path.includes('/dashboard/control-financiero')) {
      setActiveTab('control-financiero');
    } else if (path === '/dashboard' || path === '/dashboard/') {
      setActiveTab('inicio');
    }
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="fullscreen-loader">
        <Loader mensaje="Cerrando sesión..." />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="header-logo">
            <ToothIcon />
          </div>
          <h1 className="app-title">
            Consultorio <span className="app-title-aqua">AQUA</span>
          </h1>
        </div>

        <div className="user-info">
          <div className="user-avatar">{userInitial}</div>
          <span className="welcome-text">Bienvenido,</span>
          <span className="user-name">{userEmail}</span>
          <button className="logout-button" onClick={handleLogout}>
            Cerrar sesión
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
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
