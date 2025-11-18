import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './ProductReportDetail.css'; // Crearemos este
import { FaDollarSign, FaBox, FaCubes } from 'react-icons/fa'; // Iconos

// Formateadores
const formatPrice = (price) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
const formatDate = (date) => new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

const ProductReportDetail = ({ productId }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/reports/product/${productId}`);
        setReport(response.data);
      } catch (error) {
        console.error("Error al cargar reporte:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReport();
  }, [productId]);

  if (loading) return <p>Cargando reporte...</p>;
  if (!report) return <p>No se pudo cargar el reporte.</p>;

  return (
    <div className="product-report-container">
      {/* 1. KPIs (Tarjetas de métricas) */}
      <div className="report-kpi-grid">
        <div className="report-kpi-card">
          <FaDollarSign className="kpi-icon" style={{ color: '#28a745' }} />
          <span>Ingresos Totales</span>
          <strong>{formatPrice(report.totalRevenue)}</strong>
        </div>
        <div className="report-kpi-card">
          <FaBox className="kpi-icon" style={{ color: '#007bff' }} />
          <span>Unidades Vendidas</span>
          <strong>{report.totalUnitsSold}</strong>
        </div>
        <div className="report-kpi-card">
          <FaCubes className="kpi-icon" style={{ color: '#ffc107' }} />
          <span>Stock Actual</span>
          <strong>{report.currentStock}</strong>
        </div>
      </div>

      {/* 2. Lista de Pedidos Recientes */}
      <div className="report-orders-list">
        <h3>Pedidos Recientes con este Producto</h3>
        {report.recentOrders.length > 0 ? (
          <ul>
            {report.recentOrders.map(order => (
              <li key={order.order_id}>
                <div className="order-info">
                  <strong>Orden #{order.order_id}</strong>
                  <span>Cliente: {order.customer_name}</span>
                  <span>Fecha: {formatDate(order.created_at)}</span>
                </div>
                <div className="order-quantity">
                  <strong>{order.quantity}</strong>
                  <span>Unid.</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Este producto aún no ha sido incluido en ningún pedido.</p>
        )}
      </div>
    </div>
  );
};

export default ProductReportDetail;