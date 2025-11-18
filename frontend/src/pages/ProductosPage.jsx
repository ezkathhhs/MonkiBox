import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TiendaLayout from '../components/4_templates/TiendaLayout';
import ProductGrid from '../components/3_organisms/ProductGrid';
import './ProductosPage.css';

const API_URL = 'http://localhost:4000/api';

const ProductosPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/products`);
        
        // 1. Filtramos solo productos 'activos'
        const activeProducts = response.data.filter(p => p.status === 'activo');
        
        // 2. Ordenamos alfabéticamente por nombre
        activeProducts.sort((a, b) => a.name.localeCompare(b.name));
        
        setProducts(activeProducts);
        setError(null);
      } catch (err) {
        setError('Error al cargar los productos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <TiendaLayout>
      <div className="productos-page-container">
        <div className="productos-header">
          <h1>Nuestros Productos</h1>
          <p>Descubre todo lo que MonkiBox tiene para ti.</p>
        </div>

        {loading && (
          <div className="loading-message">
            <p>Cargando productos...</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && (
          <ProductGrid products={products} />
        )}
      </div>
    </TiendaLayout>
  );
};

export default ProductosPage;