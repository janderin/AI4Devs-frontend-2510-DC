/**
 * Configuración centralizada de la API
 * Usa REACT_APP_API_BASE_URL o REACT_APP_API_URL como variable de entorno
 * Si no está definida, usa el valor por defecto
 */
const getApiBaseUrl = () => {
  return (
    process.env.REACT_APP_API_BASE_URL ||
    process.env.REACT_APP_API_URL ||
    'http://127.0.1.1:3010'
  );
};

export const API_BASE_URL = getApiBaseUrl();
