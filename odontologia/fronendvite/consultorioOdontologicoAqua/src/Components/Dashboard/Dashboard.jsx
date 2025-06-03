import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import PatientRegistration from '../PatientRegistration';
import TablaPacientes from '../TablaPacientes';
import Loader from '../Loader';

const Dashboard = () => {
  const navigate = useNavigate();
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
    { id: 'inicio', label: 'Inicio' },
    { id: 'pacientes', label: 'Pacientes' },
    { id: 'citas', label: 'Citas' },
    { id: 'tratamientos', label: 'Tratamientos' },
    { id: 'reportes', label: 'Reportes' },
  ];

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
                onClick={() => setActiveTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <main className="dashboard-content">
            {activeTab === 'inicio' && (
              <PatientRegistration />
            )}
            {activeTab === 'pacientes' && (
              <TablaPacientes usuarioId={userId} />
            )}
          </main>
        </>
      )}
    </div>
  );
};

export default Dashboard; 