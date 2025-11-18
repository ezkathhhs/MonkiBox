import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import AdminLayout from '../components/4_templates/AdminLayout';
import ProductTable from '../components/3_organisms/ProductTable';
import Modal from '../components/2_molecules/Modal';
import ProductForm from '../components/3_organisms/ProductForm';
import Button from '../components/1_atoms/Button';
import Alert from '../components/1_atoms/Alert';
import './AdminUserPage.css'; // Reutilizamos el CSS de la página de admin
import ProductReportDetail from '../components/3_organisms/ProductReportDetail';

const AdminProductPage = () => {
  const [products, setProducts] = useState([]); // Lista de productos
  const [modalType, setModalType] = useState(null); // 'create', 'edit', 'reports'
  const [currentProduct, setCurrentProduct] = useState(null); // Producto seleccionado
  const [error, setError] = useState(null);

  // 1. Cargar productos
  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      setError('Error al cargar los productos.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Manejadores de Modales
  const handleOpenModal = (type, product = null) => {
    setModalType(type);
    setCurrentProduct(product);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setCurrentProduct(null);
  };

  // 3. Acciones CRUD
  const handleCreateProduct = async (formData) => {
    try {
      await api.post('/products', formData);
      fetchProducts();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear el producto.');
    }
  };

  const handleUpdateProduct = async (formData) => {
    try {
      await api.put(`/products/${currentProduct.product_id}`, formData);
      fetchProducts();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar el producto.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await api.delete(`/products/${productId}`);
        fetchProducts();
      } catch (err) {
        setError(err.response?.data?.error || 'Error al eliminar el producto.');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Gestión de Productos</h1>
        <Button onClick={() => handleOpenModal('create')}>
          Crear Nuevo Producto
        </Button>
      </div>

      <ProductTable
        products={products}
        onEdit={(product) => handleOpenModal('edit', product)}
        onReports={(product) => handleOpenModal('reports', product)}
        onDelete={handleDeleteProduct}
      />

      <Alert message={error} onClose={() => setError(null)} />

      {/* Modal para CREAR */}
      <Modal isOpen={modalType === 'create'} onClose={handleCloseModal} title="Crear Nuevo Producto">
        <ProductForm
          onSubmit={handleCreateProduct}
          buttonText="Crear Producto"
        />
      </Modal>

      {/* Modal para EDITAR */}
      <Modal isOpen={modalType === 'edit'} onClose={handleCloseModal} title="Modificar Producto">
        <ProductForm
          initialData={currentProduct}
          onSubmit={handleUpdateProduct}
          buttonText="Guardar Cambios"
        />
      </Modal>

      {/* Modal para REPORTES */}
      <Modal isOpen={modalType === 'reports'} onClose={handleCloseModal} title={`Reporte de: ${currentProduct?.name || 'Producto'}`}>
        {currentProduct && (<ProductReportDetail productId={currentProduct.product_id} />)}
      </Modal>

    </AdminLayout>
  );
};

export default AdminProductPage;