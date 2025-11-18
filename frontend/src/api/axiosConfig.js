import axios from 'axios';

// process.env.REACT_APP_API_URL es la variable que pusimos en Render.
// Si esa variable no existe, usará 'localhost'.
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// Crea una "instancia" de axios
const api = axios.create({
  baseURL: baseURL
});

// Crea el "Interceptor"
// Esto se ejecuta ANTES de que CUALQUIER petición sea enviada
api.interceptors.request.use(
  (config) => {
    // Obtiene el token de sessionStorage
    const token = sessionStorage.getItem('token');
    if (token) {
      // Si el token existe, lo añade a los headers
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config; // Devuelve la petición modificada
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;