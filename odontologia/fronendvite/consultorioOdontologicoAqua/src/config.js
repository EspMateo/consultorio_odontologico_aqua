// Configuración de la API
export const API_BASE_URL =  VITE_API_URL //'http://localhost:8080/api';

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
}; 
