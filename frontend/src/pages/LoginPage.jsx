import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/3_organisms/LoginForm';
import AuthLayout from '../components/4_templates/AuthLayout';
import { login as authServiceLogin } from '../services/authService';
import Alert from '../components/1_atoms/Alert';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { login: contextLogin } = useAuth();

  const handleLogin = async (formData) => {
    const response = await authServiceLogin(formData);

    if (response.user) {
      setError(null); 
      contextLogin(response.user);
      
      if (response.user.role === 'admin') {
        navigate('/dashboard'); 
      } else {
        navigate('/'); 
      }
    } else {
      setError(response.error);
    }
  };

  return (
    <>
      <AuthLayout>
        <LoginForm onLogin={handleLogin} />
      </AuthLayout>
      <Alert message={error} onClose={() => setError(null)} />
    </>
  );
};

export default LoginPage;