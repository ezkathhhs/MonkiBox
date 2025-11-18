import React from 'react';
import { Link } from 'react-router-dom'; // Usamos Link para la navegación

// Recibe título, descripción, el enlace (to) y un ícono
const ActionCard = ({ title, description, to, icon }) => {
  return (
    <Link to={to} className="action-card">
      {/* Usamos emojis como placeholder, 
        más adelante podemos instalar una librería de íconos 
      */}
      <div className="action-card-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  );
};

export default ActionCard;