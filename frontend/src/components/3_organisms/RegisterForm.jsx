import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FormField from '../2_molecules/FormField';
import Button from '../1_atoms/Button';

// Recibimos una función 'onRegister' que se llamará cuando el form sea válido
const RegisterForm = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Esta función actualiza el estado cada vez que escribes en un input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Esta función se ejecuta al enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    // Pasamos los datos del formulario a la función que recibimos por props
    onRegister(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Cuenta</h2>
      <FormField
        label="Nombre"
        type="text"
        placeholder="Tu nombre completo"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
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
        placeholder="Crea una contraseña segura"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />

      <div className="links">
        <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
      </div>

      <Button type="submit">Registrarse</Button>
    </form>
  );
};

export default RegisterForm;