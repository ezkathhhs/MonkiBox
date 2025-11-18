import React from 'react';

// Este componente es solo "presentacional", recibe datos y los muestra.
const StatCard = ({ title, number }) => {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <div className="stat-number">{number}</div>
    </div>
  );
};

export default StatCard;