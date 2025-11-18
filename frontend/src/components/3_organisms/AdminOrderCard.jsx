import React, { useState } from 'react';
import axios from 'axios';
import './AdminOrderCard.css';

const API_URL = 'http://localhost:4000/api';

const AdminOrderCard = ({ order, onInfoClick }) => {
  const [currentStatus, setCurrentStatus] = useState(order.order_status);
  const [menuOpen, setMenuOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Para la animación

  // Formatear
  const formatPrice = (price) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  const formatDate = (date) => new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // Función para cambiar el estado
  const handleChangeStatus = async (newStatus) => {
    if (newStatus === 'Preparando') {
      setIsLoading(true); // Activa la animación
    }
    
    try {
      const response = await axios.put(`${API_URL}/order-status/${order.order_id}`, { status: newStatus });
      setCurrentStatus(response.data.order_status);
      
      if (newStatus !== 'Preparando') {
        setIsLoading(false); // Detiene la animación si no es "Preparando"
        setStatusMenuOpen(false); // Cierra el menú de estado
        setMenuOpen(false); // Cierra el menú principal
      }

    } catch (error) {
      console.error("Error al cambiar estado:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className={`admin-order-card ${isLoading ? 'is-loading' : ''}`}>
      <div className="card-main-info">
        <div className="info-col">
          <span>Cliente</span>
          <strong>{order.customer_name}</strong>
        </div>
        <div className="info-col">
          <span>N° Orden</span>
          <strong>#{order.order_id}</strong>
        </div>
        <div className="info-col">
          <span>Fecha</span>
          <strong>{formatDate(order.created_at)}</strong>
        </div>
        <div className="info-col">
          <span>Total</span>
          <strong>{formatPrice(order.total_amount)}</strong>
        </div>
      </div>
      
      <div className="card-status-section">
        {/* La "pestañita" de estado */}
        <span className={`status-pill ${currentStatus.replace(' ', '-').toLowerCase()}`}>
          {isLoading ? (
            <>
              <div className="spinner"></div> {/* Animación en bucle */}
              Preparando...
            </>
          ) : (
            currentStatus
          )}
        </span>
      </div>
      
      {/* Menú de 3 Puntos */}
      <div className="card-actions">
        <button onClick={() => setMenuOpen(!menuOpen)} className="dots-btn">⋮</button>
        
        {menuOpen && (
          <div className="dropdown-menu">
            {/* 1. Botón de INFO */}
            <button onClick={() => { onInfoClick(order.order_id); setMenuOpen(false); }}>
              Info
            </button>
            
            {/* 2. Botón de ESTADO (abre otro menú) */}
            <button onClick={() => setStatusMenuOpen(!statusMenuOpen)}>
              Estado
            </button>

            {/* 3. Submenú de ESTADO */}
            {statusMenuOpen && (
              <div className="status-submenu">
                <button onClick={() => handleChangeStatus('En espera')}>En espera</button>
                <button onClick={() => handleChangeStatus('Preparando')}>Preparando</button>
                <button onClick={() => handleChangeStatus('Finalizado')}>Finalizado</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderCard;