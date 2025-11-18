import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../components/4_templates/AdminLayout';
import UserTable from '../components/3_organisms/UserTable';
import Modal from '../components/2_molecules/Modal';
import UserForm from '../components/3_organisms/UserForm';
import Button from '../components/1_atoms/Button';
import Alert from '../components/1_atoms/Alert';
import './AdminUserPage.css'; 

// --- 1. IMPORTAR LOS NUEVOS COMPONENTES ---
import UserOrdersList from '../components/3_organisms/UserOrdersList';
import OrderSuccessModal from '../components/3_organisms/OrderSuccessModal';

const API_URL = 'http://localhost:4000/api';

const AdminUserPage = () => {
  const [users, setUsers] = useState([]);
  const [modalType, setModalType] = useState(null); // 'create', 'edit', 'history'
  const [currentUser, setCurrentUser] = useState(null); 
  const [error, setError] = useState(null);

  // --- 2. NUEVOS ESTADOS PARA EL MODAL DE BOLETA ---
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedOrderData, setSelectedOrderData] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (err) {
      setError('Error al cargar los usuarios.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Abrir modal principal (Crear, Editar, Historial)
  const handleOpenModal = (type, user = null) => {
    setModalType(type);
    setCurrentUser(user);
  };

  // Cerrar modal principal
  const handleCloseModal = () => {
    setModalType(null);
    setCurrentUser(null);
  };

  // --- 3. NUEVA FUNCIÓN PARA ABRIR LA BOLETA (desde la lista) ---
  const handleViewReceipt = async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/order-details/${orderId}`);
      setSelectedOrderData(response.data);
      setIsReceiptModalOpen(true); // Abre el segundo modal
    } catch (err) {
      setError("Error al cargar la boleta.");
    }
  };

  // --- 4. NUEVA FUNCIÓN PARA CERRAR LA BOLETA ---
  const handleCloseReceiptModal = () => {
    setIsReceiptModalOpen(false);
    setSelectedOrderData(null);
    // Nota: No cerramos el modal de historial, se queda abierto detrás.
  };

  // --- (Lógica de Create, Update, Delete se mantiene igual) ---
  const handleCreateUser = async (formData) => { /* ... (código existente sin cambios) ... */ };
  const handleUpdateUser = async (formData) => { /* ... (código existente sin cambios) ... */ };
  const handleDeleteUser = async (userId) => { /* ... (código existente sin cambios) ... */ };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Gestión de Usuarios</h1>
        <Button onClick={() => handleOpenModal('create')}>
          Crear Nuevo Usuario
        </Button>
      </div>

      <UserTable
        users={users}
        onEdit={(user) => handleOpenModal('edit', user)}
        onHistory={(user) => handleOpenModal('history', user)} // <-- Esto ahora funciona
        onDelete={handleDeleteUser}
      />

      <Alert message={error} onClose={() => setError(null)} />

      {/* Modal para CREAR */}
      <Modal isOpen={modalType === 'create'} onClose={handleCloseModal} title="Crear Nuevo Usuario">
        <UserForm
          onSubmit={handleCreateUser}
          buttonText="Crear Usuario"
        />
      </Modal>

      {/* Modal para EDITAR */}
      <Modal isOpen={modalType === 'edit'} onClose={handleCloseModal} title="Modificar Usuario">
        <UserForm
          initialData={currentUser}
          onSubmit={handleUpdateUser}
          buttonText="Guardar Cambios"
        />
      </Modal>

      {/* --- 5. MODAL DE HISTORIAL (AHORA FUNCIONAL) --- */}
      <Modal isOpen={modalType === 'history'} onClose={handleCloseModal} title={`Historial de ${currentUser?.name}`}>
        {currentUser && (
          <UserOrdersList 
            userId={currentUser.user_id} 
            onViewReceiptClick={handleViewReceipt} // Pasa la función al componente
          />
        )}
      </Modal>

      {/* --- 6. MODAL DE BOLETA (SE SUPERPONE AL OTRO) --- */}
      <OrderSuccessModal 
        orderData={selectedOrderData}
        isOpen={isReceiptModalOpen}
        onClose={handleCloseReceiptModal}
      />

    </AdminLayout>
  );
};

export default AdminUserPage;