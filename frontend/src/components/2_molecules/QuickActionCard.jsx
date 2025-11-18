import React from 'react';
import { Link } from 'react-router-dom';
import './QuickActionCard.css';

// Recibe props: icon, title, description, y 'to' (la ruta)
const QuickActionCard = ({ icon, title, description, to }) => {
  return (
    <Link to={to} className="quick-action-card">
      <div className="qa-icon-wrapper">
        {icon}
      </div>
      <div className="qa-text-wrapper">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </Link>
  );
};

export default QuickActionCard;