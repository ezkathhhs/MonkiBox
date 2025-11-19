import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; // Usamos nuestra api configurada
import TiendaLayout from '../components/4_templates/TiendaLayout';
import ImageCarousel from '../components/3_organisms/ImageCarousel';
import ProductGrid from '../components/3_organisms/ProductGrid'; // Importamos el Grid
import './TiendaHomePage.css';

const TiendaHomePage = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos más vendidos
  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/reports/top-selling');
        setTopProducts(response.data);
      } catch (error) {
        console.error("Error cargando destacados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  return (
    <TiendaLayout>
      {/* 1. Carrusel */}
      <ImageCarousel />

      {/* 2. Sección de Productos Destacados (Más Vendidos) */}
      <section className="promo-section">
        <h2>Productos Destacados</h2>
        <p>¡Los favoritos de la comunidad MonkiBox!</p>
        
        {loading ? (
          <p>Cargando lo mejor de lo mejor...</p>
        ) : (
          // Reutilizamos tu ProductGrid existente
          <div className="home-product-grid-wrapper">
             <ProductGrid products={topProducts} />
          </div>
        )}
      </section>

    </TiendaLayout>
  );
};

export default TiendaHomePage;