import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

const AuthContext = createContext();

// 2. Crear el Proveedor (Provider)
// Este componente envolverá tu App
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { clearCart } = useCart();

  // Al cargar, revisar si hay un usuario en sessionStorage
  useEffect(() => {
    const loggedUserJSON = sessionStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      setUser(JSON.parse(loggedUserJSON));
    }
  }, []);

  // Función para guardar el usuario (la llamaremos desde LoginPage)
  const login = (userData) => {
    sessionStorage.setItem('loggedUser', JSON.stringify(userData));
    setUser(userData);
  };

  // Función para cerrar sesión
  const logout = () => {
    sessionStorage.removeItem('loggedUser');
    sessionStorage.removeItem('token');
    setUser(null);
    clearCart();
    navigate('/login');
  };

  const updateUser = (updatedUserData) => {
    sessionStorage.setItem('loggedUser', JSON.stringify(updatedUserData));
    setUser(updatedUserData);
  };

  // 3. Exponer el 'user' y las funciones
  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};