import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TiendaLayout from '../components/4_templates/TiendaLayout';
import ProductGrid from '../components/3_organisms/ProductGrid';
import './ProductosPage.css'; // Reutilizamos estilos

const API_URL = 'http://localhost:4000/api';

const OfertasPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/products`);
        
        // FILTRO: Solo productos activos Y con descuento mayor a 0
        const offerProducts = response.data.filter(p => 
          p.status === 'activo' && p.discount_percentage > 0
        );
        
        setProducts(offerProducts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return (
    <TiendaLayout>
      <div className="productos-page-container">
        <div className="productos-header">
          <h1 style={{ color: '#e53e3e' }}>🔥 Ofertas Especiales 🔥</h1>
          <p>¡Aprovecha estos precios increíbles antes de que se agoten!</p>
        </div>

        {!loading && products.length === 0 && (
          <div className="loading-message">
            <p>No hay ofertas disponibles en este momento. ¡Vuelve pronto!</p>
          </div>
        )}
        
        {!loading && products.length > 0 && (
          <ProductGrid products={products} />
        )}
      </div>
    </TiendaLayout>
  );
};

export default OfertasPage;