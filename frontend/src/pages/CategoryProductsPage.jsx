import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Para leer la categoría de la URL
import api from '../api/axiosConfig';
import TiendaLayout from '../components/4_templates/TiendaLayout';
import ProductGrid from '../components/3_organisms/ProductGrid';
import './ProductosPage.css'; // Reutilizamos el CSS de la página de productos

const CategoryProductsPage = () => {
  const { categoryName } = useParams(); // Obtenemos 'BlindBox', 'Peluche', etc.
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Obtenemos TODOS los productos (idealmente el backend filtraría, pero esto sirve para empezar)
        const response = await api.get('/products');
        
        // Filtramos en el frontend:
        // 1. Que coincida la categoría
        // 2. Que el estado sea 'activo'
        const filteredProducts = response.data.filter(p => 
          p.category === categoryName && p.status === 'activo'
        );
        
        // Ordenamos alfabéticamente
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        
        setProducts(filteredProducts);
        setError(null);
      } catch (err) {
        setError('Error al cargar los productos de esta categoría.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  return (
    <TiendaLayout>
      <div className="productos-page-container">
        <div className="productos-header">
          {/* Título Dinámico */}
          <h1>{categoryName}s</h1>
          <p>Explorando todos nuestros productos de {categoryName}.</p>
        </div>

        {loading && (
          <div className="loading-message"><p>Cargando...</p></div>
        )}
        
        {error && (
          <div className="error-message"><p>{error}</p></div>
        )}
        
        {!loading && !error && products.length === 0 && (
           <div className="loading-message"><p>No hay productos en esta categoría aún.</p></div>
        )}

        {!loading && !error && products.length > 0 && (
          <ProductGrid products={products} />
        )}
      </div>
    </TiendaLayout>
  );
};

export default CategoryProductsPage;