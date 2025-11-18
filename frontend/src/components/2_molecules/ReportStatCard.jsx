import React from 'react';
import './ReportStatCard.css';

// Recibe un icono, un título y el valor (número)
const ReportStatCard = ({ icon, title, value }) => {
  return (
    <div className="report-stat-card">
      <div className="stat-icon-wrapper">
        {icon}
      </div>
      <div className="stat-info">
        <span className="stat-value">{value}</span>
        <span className="stat-title">{title}</span>
      </div>
    </div>
  );
};

export default ReportStatCard;