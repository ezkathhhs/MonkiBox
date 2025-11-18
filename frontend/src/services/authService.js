import axios from 'axios';

// Esta es la URL de tu servidor backend.
const API_URL = 'http://localhost:4000/api';

/**
 * Registra un nuevo usuario llamando a la API.
 */
export const register = async (formData) => {
  try {
    const { name, email, password } = formData;
    
    // Llama al endpoint POST /api/register
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
    });

    // Si tiene éxito, devuelve el usuario (sin el hash)
    return { user: response.data, error: null };

  } catch (error) {
    // Si la API devuelve un error (ej. email ya existe), lo capturamos
    console.error("Error en el registro:", error.response.data);
    return { 
      user: null, 
      // Devolvemos el mensaje de error que viene del backend
      error: error.response.data.error || 'Ocurrió un error inesperado.' 
    };
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
    // Si la API devuelve un error (ej. contraseña incorrecta), lo capturamos
    console.error("Error en el login:", error.response.data);
    return { 
      user: null, 
      error: error.response.data.error || 'Ocurrió un error inesperado.' 
    };
  }
};