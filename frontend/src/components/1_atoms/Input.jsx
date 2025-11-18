import React from 'react';
import './Input.css';

// Usamos ...props para pasar atributos estándar de HTML (type, placeholder, etc.)
const Input = ({ type = 'text', placeholder, value, onChange, name }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      className="atomic-input"
    />
  );
};

export default Input;   