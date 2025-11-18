import React, { useState } from 'react';
import './ProductTable.css'; // Crearemos este

// Recibimos las funciones para Editar, Reportes y Eliminar
const ProductTable = ({ products, onEdit, onReports, onDelete }) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const toggleDropdown = (productId) => {
    setOpenDropdownId(openDropdownId === productId ? null : productId);
  };

  // Formatear el precio a moneda (CLP como ejemplo, puedes ajustarlo)
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Oferta</th>
            <th>Precio Venta</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.product_id}>
              <td>{product.product_id}</td>
              <td className="cell-image">
                <img 
                  src={product.image_url || '/mono.jpg'} 
                  alt={product.name} 
                  className="product-image"
                />
              </td>
              <td>{product.name}</td>
              
              <td>
                {product.discount_percentage > 0 ? (
                  <span style={{ color: '#00a650', fontWeight: 'bold' }}>
                    {product.discount_percentage}%
                  </span>
                ) : (
                  <span style={{ color: '#999' }}>N/A</span>
                )}
              </td>

              <td>{formatPrice(product.price)}</td>
              
              <td>{product.category}</td>
              <td>{product.stock}</td>
              <td>
                <span className={`status-badge ${product.status === 'activo' ? 'status-active' : 'status-inactive'}`}>
                  {product.status}
                </span>
              </td>
              <td className="actions-cell">
                 <button onClick={() => toggleDropdown(product.product_id)} className="dots-btn">⋮</button>
                 {openDropdownId === product.product_id && (
                  <div className="dropdown-menu">
                    <button onClick={() => { onEdit(product); setOpenDropdownId(null); }}>Editar</button>
                    <button onClick={() => { onReports(product); setOpenDropdownId(null); }}>Reportes</button>
                    <button onClick={() => { onDelete(product.product_id); setOpenDropdownId(null); }} className="delete">Eliminar</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;