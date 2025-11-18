import React from 'react';
import TiendaLayout from '../components/4_templates/TiendaLayout';
import ImageCarousel from '../components/3_organisms/ImageCarousel';
import './TiendaHomePage.css'; // CSS para el contenido extra

const TiendaHomePage = () => {
  return (
    <TiendaLayout>
      {/* 1. Carrusel Requerido */}
      <ImageCarousel />

      {/* 2. Contenido Adicional (Libertad Creativa) */}
      <section className="promo-section">
        <h2>Productos Destacados</h2>
        <p>¡Echa un vistazo a lo más popular de la semana!</p>
        {/* Aquí iría un organismo <ProductGrid> en el futuro */}
        <div className="placeholder-grid">
          <div className="placeholder-card">[Producto 1]</div>
          <div className="placeholder-card">[Producto 2]</div>
          <div className="placeholder-card">[Producto 3]</div>
          <div className="placeholder-card">[Producto 4]</div>
        </div>
      </section>

    </TiendaLayout>
  );
};

export default TiendaHomePage;