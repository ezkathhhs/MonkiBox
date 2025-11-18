import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
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

const AdminUserPage = () => {
  const [users, setUsers] = useState([]);
  const [modalType, setModalType] = useState(null); // 'create', 'edit', 'history'
  const [currentUser, setCurrentUser] = useState(null); 
  const [error, setError] = useState(null);

  // --- ESTADOS PARA EL MODAL DE BOLETA ---
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedOrderData, setSelectedOrderData] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
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
      const response = await api.get(`/order-details/${orderId}`);
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
  const handleCreateUser = async (formData) => {
    try {
      await api.post('/users', formData);
      fetchUsers(); 
      handleCloseModal();
    } catch (err) {
      setError(err.response.data.error || 'Error al crear el usuario.');
    }
  };

  const handleUpdateUser = async (formData) => {
    const dataToSend = { ...formData };
    if (!dataToSend.password) {
      delete dataToSend.password;
    }

    try {
      await api.put(`/users/${currentUser.user_id}`, dataToSend);
      fetchUsers(); 
      handleCloseModal();
    } catch (err) {
      setError(err.response.data.error || 'Error al actualizar el usuario.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await api.delete(`/users/${userId}`);
        fetchUsers(); 
      } catch (err) {
        setError(err.response.data.error || 'Error al eliminar el usuario.');
      }
    }
  };

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
        onHistory={(user) => handleOpenModal('history', user)}
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