import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FormField from '../2_molecules/FormField';
import Button from '../1_atoms/Button';

// Recibimos 'onLogin' que se llamará al enviar
const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>
      <FormField
        label="Correo Electrónico"
        type="email"
        placeholder="ejemplo@correo.com"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <FormField
        label="Contraseña"
        type="password"
        placeholder="Tu contraseña"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      
      <div className="links">
        <Link to="/register">¿No tienes cuenta? Regístrate</Link>
      </div>

      <Button type="submit">Iniciar Sesion</Button>
    </form>
  );
};

export default LoginForm;