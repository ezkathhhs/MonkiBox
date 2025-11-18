import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import AdminLayout from '../components/4_templates/AdminLayout';
import AdminOrderCard from '../components/3_organisms/AdminOrderCard';
import OrderSuccessModal from '../components/3_organisms/OrderSuccessModal';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para el modal de "Info"
  const [selectedOrderData, setSelectedOrderData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Cargar todas las órdenes al inicio
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (error) {
        console.error("Error al cargar órdenes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // 2. Función para abrir el modal de "Info"
  // Esta función es la que se pasa al AdminOrderCard
  const handleInfoClick = async (orderId) => {
    try {
      // Llama al nuevo endpoint para obtener los detalles completos
      const response = await api.get(`/order-details/${orderId}`);
      setSelectedOrderData(response.data); // Guarda { order, items }
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error al cargar detalles de la orden:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderData(null);
  };

  return (
    <AdminLayout>
      <div className="admin-page-header" style={{ marginBottom: '2rem' }}>
        <h1>Gestión de Pedidos</h1>
      </div>
      
      {loading ? (
        <p>Cargando pedidos...</p>
      ) : (
        <div className="orders-list-container">
          {orders.map(order => (
            <AdminOrderCard 
              key={order.order_id} 
              order={order} 
              onInfoClick={handleInfoClick} 
            />
          ))}
        </div>
      )}

      {/* 3. Modal de Info (Reutilizado) */}
      <OrderSuccessModal 
        orderData={selectedOrderData}
        isOpen={isModalOpen} // Prop extra para controlar visibilidad
        onClose={handleCloseModal}
      />
    </AdminLayout>
  );
};

export default AdminOrdersPage;