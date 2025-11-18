import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/3_organisms/RegisterForm';
import AuthLayout from '../components/4_templates/AuthLayout';
import { register } from '../services/authService';
import Alert from '../components/1_atoms/Alert';
import ConfirmationModal from '../components/2_molecules/ConfirmationModal';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Guardamos los datos del formulario temporalmente
  const [formData, setFormData] = useState(null);

  const handleFormSubmit = (data) => {
    // Validamos que los campos no estén vacíos antes de abrir el modal
    if (!data.name || !data.email || !data.password) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    setError(null); // Limpiamos errores
    setFormData(data); // Guardamos los datos
    setIsModalOpen(true); // Abrimos el modal
  };

  const handleConfirmRegister = async () => {
    if (!formData) return; // Seguridad
    
    setIsModalOpen(false); // Cerramos el modal
    const response = await register(formData); // Enviamos los datos guardados
    
    if (response.user) {
      navigate('/login');
    } else {
      setError(response.error);
    }
    setFormData(null);
  };

  const handleCancelRegister = () => {
    setIsModalOpen(false);
    setFormData(null);
  };

  return (
    <>
      <AuthLayout>
        <RegisterForm onRegister={handleFormSubmit} />
      </AuthLayout>

      <Alert message={error} onClose={() => setError(null)} />
      
      <ConfirmationModal 
        isOpen={isModalOpen}
        onConfirm={handleConfirmRegister}
        onCancel={handleCancelRegister}
      />
    </>
  );
};

export default RegisterPage;