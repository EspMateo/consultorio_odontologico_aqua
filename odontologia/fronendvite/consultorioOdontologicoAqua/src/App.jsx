import './App.css'
import Login from './Components/Login/Login';
// Registro deshabilitado temporalmente
// import Register from './Components/Register/Register';
import Dashboard from './Components/Dashboard/Dashboard';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import EditarPaciente from './Components/EditarPaciente';
import HistoriaClinica from './Components/HistoriaClinica';
import TablaPacientes from './Components/TablaPacientes';
import PatientRegistration from './Components/PatientRegistration';
import Odontograma from './Components/Odontograma/Odontograma';
import Periodoncia from './Components/Periodoncia/Periodoncia';
import Periodontograma from './Components/Periodontograma/Periodontograma';
import Presupuesto from './Components/Presupuesto/Presupuesto';
import ControlFinanciero from './Components/ControlFinanciero/ControlFinanciero';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Registro deshabilitado - redirige automáticamente al login */}
        <Route path="/register" element={<Navigate to="/" replace />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<PatientRegistration />} />
          <Route path="pacientes" element={<TablaPacientes />} />
          <Route path="pacientes/editar/:id" element={<EditarPaciente />} />
          <Route path="pacientes/historia-clinica/:id" element={<HistoriaClinica />} />
          <Route path="pacientes/odontograma/:id" element={<Odontograma />} />
          <Route path="pacientes/periodontograma/:id" element={<Periodontograma />} />
          <Route path="pacientes/periodoncia/:id" element={<Periodoncia />} />
          <Route path="pacientes/presupuesto/:id" element={<Presupuesto />} />
          <Route path="control-financiero" element={<ControlFinanciero />} />
        </Route>
      </Routes>
    </Router>
  );
}
  
export default App
