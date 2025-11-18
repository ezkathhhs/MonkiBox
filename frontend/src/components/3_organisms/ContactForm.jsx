import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import FormField from '../2_molecules/FormField';
import Button from '../1_atoms/Button';
import SuccessToast from '../1_atoms/SuccessToast';
import './ContactForm.css'; // Crearemos este

const ContactForm = () => {
  // Obtener el usuario del contexto
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [showToast, setShowToast] = useState(false);

  // Efecto para autocompletar si el usuario existe
  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]); // Se ejecuta cada vez que 'user' cambia

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulación de envío
    console.log("Formulario enviado (simulación):", formData);
    
    // Mostrar el toast
    setShowToast(true);
    
    // Limpiar el mensaje y ocultar el toast después de 3 segundos
    setFormData((prevData) => ({ ...prevData, message: '' }));
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="contact-form-wrapper">
      <form onSubmit={handleSubmit}>
        <FormField
          label="Nombre"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Tu nombre completo"
          // Deshabilitar si el usuario está logeado
          disabled={!!user}
        />
        <FormField
          label="Correo Electrónico"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="ejemplo@correo.com"
          // Deshabilitar si el usuario está logeado
          disabled={!!user}
        />
        
        {/* Campo de Mensaje (Textarea) */}
        <div className="form-field-textarea">
          <label htmlFor="message">Mensaje</label>
          <textarea
            name="message"
            id="message"
            rows="6"
            value={formData.message}
            onChange={handleChange}
            placeholder="Escribe tu consulta aquí..."
            required
          ></textarea>
        </div>

        <Button type="submit">Enviar Mensaje</Button>
      </form>
      
      {/* El Toast */}
      <SuccessToast
        message="¡Mensaje enviado correctamente!"
        isVisible={showToast}
      />
    </div>
  );
};

export default ContactForm;