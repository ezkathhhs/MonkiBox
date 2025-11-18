import React from 'react';
import './AuthLayout.css';

// 'children' será el formulario (Organismo) que le pasemos
const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        
        {/* AÑADIDO: El logo de MonkiBox */}
        <img 
          src="/mono.jpg" 
          alt="Logo de MonkiBox" 
          className="auth-logo" 
        />
        
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;