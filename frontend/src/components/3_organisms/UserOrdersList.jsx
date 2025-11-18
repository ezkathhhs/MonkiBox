import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserOrdersList.css'; // Crearemos este

const API_URL = 'http://localhost:4000/api';

const UserOrdersList = ({ userId, onViewReceiptClick }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Formateadores
  const formatPrice = (price) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  const formatDate = (date) => new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });

  // 1. Buscar las órdenes de este usuario al cargar
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/user-orders/${userId}`);
        setOrders(response.data);
      } catch (err) {
        setError('Error al cargar el historial.');
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  if (loading) return <p>Cargando historial...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (orders.length === 0) return <p>Este usuario no tiene historial de compras.</p>;

  // 2. Mostrar la lista
  return (
    <div className="user-orders-list">
      {orders.map(order => (
        <div key={order.order_id} className="user-order-item">
          <div className="order-item-info">
            <strong>Orden #{order.order_id}</strong>
            <span>{formatDate(order.created_at)}</span>
            <span className={`status-pill-small ${order.order_status.replace(' ', '-').toLowerCase()}`}>
              {order.order_status}
            </span>
          </div>
          <div className="order-item-actions">
            <span className="order-item-total">{formatPrice(order.total_amount)}</span>
            {/* 3. Botón para abrir la boleta completa */}
            <button 
              className="view-receipt-btn"
              onClick={() => onViewReceiptClick(order.order_id)}
            >
              Ver Boleta
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserOrdersList;