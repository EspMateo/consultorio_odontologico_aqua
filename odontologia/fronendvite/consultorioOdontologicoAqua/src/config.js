import axios from 'axios';

// Detectar si estamos ejecutando en Electron
const isElectron = typeof window !== 'undefined' &&
  (window.process?.type === 'renderer' || window.navigator?.userAgent?.includes('Electron'));

// Adjuntar automáticamente el token JWT (guardado en el login) a cada request
axios.interceptors.request.use((requestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
});

// Si el backend responde 401 (token vencido o inválido), cerrar la sesión
// localmente y mandar de vuelta al login.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      window.location.hash = '#/';
    }
    return Promise.reject(error);
  }
);

// Configuración de la API
// En Electron, puedes usar una URL diferente si es necesario
// Por defecto, usa la variable de entorno o localhost
const getApiBaseUrl = () => {
  // Prioridad: variable de entorno > fallback a localhost
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // En Electron, asumimos que el backend está en localhost
  // Puedes cambiar esto según tu configuración
  return 'http://localhost:8080/api';
};

export const API_BASE_URL = getApiBaseUrl();

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// Exportar información útil para debugging
export const isElectronApp = isElectron; 
