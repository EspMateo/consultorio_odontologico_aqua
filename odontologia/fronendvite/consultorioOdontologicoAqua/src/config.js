// Detectar si estamos ejecutando en Electron
const isElectron = typeof window !== 'undefined' && 
  (window.process?.type === 'renderer' || window.navigator?.userAgent?.includes('Electron'));

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
