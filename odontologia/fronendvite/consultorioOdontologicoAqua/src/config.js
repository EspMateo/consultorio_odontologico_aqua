// Configuración de la API
export const API_BASE_URL =  'http://localhost:8080/api' // import.meta.env.VITE_API_URL ;

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
}; 
