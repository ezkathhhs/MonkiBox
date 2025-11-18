import React from 'react';
import './Button.css';

const Button = ({ children, onClick, type = 'button' }) => {
  return (
    <button type={type} onClick={onClick} className="atomic-button">
      {children}
    </button>
  );
};

export default Button;