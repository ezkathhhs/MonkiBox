import React from 'react';
import './Alert.css';

// Recibe el mensaje y una función 'onClose' para cerrarlo
const Alert = ({ message, onClose }) => {
  // Si no hay mensaje, no renderiza nada
  if (!message) return null;

  return (
    <div className="atomic-alert">
      <p>{message}</p>
      <button onClick={onClose} className="alert-close-btn">
        &times; {/* Este es el símbolo 'x' */}
      </button>
    </div>
  );
};

export default Alert;