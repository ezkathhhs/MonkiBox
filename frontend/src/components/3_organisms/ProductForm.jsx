import React, { useState, useEffect } from 'react';
import FormField from '../2_molecules/FormField';
import Button from '../1_atoms/Button';
import './ProductForm.css';

const ProductForm = ({ initialData, onSubmit, buttonText }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'BlindBox',
    status: 'activo',
    image_url: '',
    discount_percentage: 0,
  });

  useEffect(() => {
    if (initialData) {
      const basePrice = initialData.old_price ? initialData.old_price : initialData.price;
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: basePrice || '', 
        stock: initialData.stock || '',
        category: initialData.category || 'BlindBox',
        status: initialData.status || 'activo',
        image_url: initialData.image_url || '',
        discount_percentage: initialData.discount_percentage || 0,
      });
    } else {
      setFormData({
        name: '', description: '', price: '', stock: '', 
        category: 'BlindBox', status: 'activo', image_url: '', discount_percentage: 0
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    /* AQUÍ ESTÁ EL CAMBIO CLAVE: className="product-form-container" */
    <form onSubmit={handleSubmit} className="product-form-container">
      <FormField
        label="Nombre del Producto"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Ej: Peluche Mono Ki"
      />
      
      <div className="form-field-select">
        <label htmlFor="description">Descripción</label>
        <textarea
          name="description"
          id="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descripción detallada..."
        ></textarea>
      </div>

      <div className="form-grid-2">
        <FormField
          label="Precio Real (Sin Descuento)"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Ej: 10000"
        />
        <FormField
          label="% Oferta (0 para sin oferta)"
          type="number"
          name="discount_percentage"
          value={formData.discount_percentage}
          onChange={handleChange}
          placeholder="Ej: 20"
          min="0"
          max="100"
        />
      </div>

      <div className="form-grid-2">
        <FormField
          label="Stock"
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
        />
        
        <div className="form-field-select">
          <label htmlFor="category">Categoría</label>
          <select name="category" id="category" value={formData.category} onChange={handleChange}>
            <option value="BlindBox">BlindBox</option>
            <option value="Peluche">Peluche</option>
            <option value="Llavero">Llavero</option>
          </select>
        </div>
      </div>

      <div className="form-field-select">
        <label htmlFor="status">Estado</label>
        <select name="status" id="status" value={formData.status} onChange={handleChange}>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>
      
      <FormField
        label="URL de la Imagen"
        type="text"
        name="image_url"
        value={formData.image_url}
        onChange={handleChange}
      />

      <Button type="submit">{buttonText}</Button>
    </form>
  );
};

export default ProductForm;