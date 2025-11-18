import axios from 'axios';

// Esta es la URL de tu servidor backend.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

/**
 * Registra un nuevo usuario llamando a la API.
 */
export const register = async (formData) => {
  try {
    const { name, email, password } = formData;
    const response = await axios.post(`${API_URL}/register`, {
      name, email, password,
    });
    return { user: response.data, error: null };
  } catch (error) {
    // Si error.response existe, es un error del backend (ej. "Email duplicado")
    // Si no existe, es un error de red (ej. CORS o el backend está caído)
    let errorMessage = 'Ocurrió un error inesperado.';
    if (error.response) {
      errorMessage = error.response.data.error || errorMessage;
    } else if (error.request) {
      errorMessage = 'No se pudo conectar con el servidor. Revisa tu conexión.';
    }
    
    console.error("Error en el registro:", error.message);
    return { user: null, error: errorMessage };
  }
};

/**
 * Inicia sesión de un usuario llamando a la API.
 */
export const login = async (formData) => {
  try {
    const { email, password } = formData;

    // Llama al endpoint POST /api/login
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    // Si el login es exitoso, la API devuelve los datos del usuario (incluyendo el 'role')
    const { user, token } = response.data;

    // Guardamos el usuario logeado en sessionStorage (como hacíamos antes)
    sessionStorage.setItem('loggedUser', JSON.stringify(user));
    sessionStorage.setItem('token', token);

    return { user: user, error: null };
  } catch (error) {
    let errorMessage = 'Correo o contraseña incorrectos.';
    if (error.response) {
      errorMessage = error.response.data.error || errorMessage;
    } else if (error.request) {
      errorMessage = 'No se pudo conectar con el servidor. Revisa tu conexión.';
    }
    
    console.error("Error en el login:", error.message);
    return { user: null, error: errorMessage };
  }
};