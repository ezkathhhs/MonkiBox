import React, { useState, useEffect } from 'react';
import FormField from '../2_molecules/FormField';
import Button from '../1_atoms/Button';
import './UserForm.css'; // Crearemos este CSS

const UserForm = ({ initialData, onSubmit, buttonText }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer', // Rol por defecto
  });

  // Si 'initialData' cambia (ej. al abrir el modal de edición),
  // llenamos el formulario con esos datos.
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        password: '', // Dejamos la contraseña vacía por seguridad
        role: initialData.role || 'customer',
      });
    } else {
      // Si no hay initialData, es un formulario de 'Crear'
      setFormData({ name: '', email: '', password: '', role: 'customer' });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Llama a la función (handleCreate o handleUpdate)
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <FormField
        label="Nombre"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Nombre completo"
      />
      <FormField
        label="Correo Electrónico"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="ejemplo@correo.com"
      />
      <FormField
        label="Contraseña"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder={initialData ? '(Dejar en blanco para no cambiar)' : 'Contraseña segura'}
      />
      
      <div className="form-field-select">
        <label htmlFor="role">Rol de Usuario</label>
        <select name="role" id="role" value={formData.role} onChange={handleChange}>
          <option value="customer">Usuario</option>
          <option value="seller">Vendedor</option> {/* Tu rol "Vendedor" */}
          <option value="admin">Administrador</option>
        </select>
      </div>

      <Button type="submit">{buttonText}</Button>
    </form>
  );
};

export default UserForm;