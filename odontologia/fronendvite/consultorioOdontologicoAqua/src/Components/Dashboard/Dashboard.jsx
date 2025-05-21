import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inicio');
  const [userName, setUserName] = useState('Usuario');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        if (email) {
          const response = await axios.get(`/api/usuarios/current?email=${email}`);
          if (response.data && response.data.name) {
            setUserName(response.data.name);
          }
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    navigate('/');
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
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="app-title">Consultorio Odontológico</h1>
        </div>
        <div className="user-info">
          <span className="welcome-text">Bienvenido, Dr(a).</span>
          <span className="user-name">{loading ? 'Cargando...' : userName}</span>
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
          <div className="content-section">
            <h2>Panel de Control</h2>
            <p>Bienvenido al sistema de gestión del consultorio odontológico.</p>
          </div>
        )}
        {/* Aquí se pueden agregar más secciones según el tab activo */}
      </main>
    </div>
  );
};

export default Dashboard; 