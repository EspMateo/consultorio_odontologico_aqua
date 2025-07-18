import './App.css'
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Dashboard from './Components/Dashboard/Dashboard';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import EditarPaciente from './Components/EditarPaciente';
import HistoriaClinica from './Components/HistoriaClinica';
import TablaPacientes from './Components/TablaPacientes';
import PatientRegistration from './Components/PatientRegistration';
import Odontograma from './Components/Odontograma/Odontograma';
import Periodoncia from './Components/Periodoncia/Periodoncia';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
          <Route path="periodoncia" element={<Periodoncia />} />
        </Route>
      </Routes>
    </Router>
  );
}
  
export default App
