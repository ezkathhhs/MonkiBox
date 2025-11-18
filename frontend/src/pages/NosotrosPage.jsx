import React from 'react';
import { Link } from 'react-router-dom';
import TiendaLayout from '../components/4_templates/TiendaLayout';
import './NosotrosPage.css'; // Importamos el CSS que crearemos

const NosotrosPage = () => {
  return (
    <TiendaLayout>
      <div className="nosotros-container">
        
        {/* Encabezado con el logo */}
        <header className="nosotros-header">
          <img 
            src="/mono.jpg" 
            alt="Mascota de MonkiBox" 
            className="nosotros-logo" 
          />
          <h1>¡Conoce a la Tropa de MonkiBox!</h1>
          <p className="nosotros-subtitle">
            Más que una tienda, somos una comunidad de coleccionistas.
          </p>
        </header>

        {/* Sección de Misión */}
        <section className="nosotros-section">
          <h2>Nuestra Misión</h2>
          <p>
            En MonkiBox, vivimos por esa chispa de emoción que sientes al abrir una <strong>Blind Box</strong>, la alegría de encontrar ese <strong>peluche</strong> que te saca una sonrisa o el <strong>llavero</strong> perfecto que te acompaña en tus llaves.
          </p>
          <p>
            Nacimos de una pasión pura por el coleccionismo y la cultura pop. Nuestra misión es simple: buscar por todo el mundo los artículos más adorables, únicos y emocionantes, y traerlos directamente a tus manos.
          </p>
        </section>

        {/* Sección de Valores (en 3 columnas) */}
        <section className="nosotros-section">
          <h2>Lo que nos mueve</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>❤️ Pasión Auténtica</h3>
              <p>Somos coleccionistas, igual que tú. Cada producto en nuestra tienda es algo que nosotros mismos amaríamos tener.</p>
            </div>
            <div className="value-card">
              <h3>✨ Calidad y Confianza</h3>
              <p>Solo trabajamos con productos 100% oficiales y de alta calidad. Tu confianza es nuestra prioridad número uno.</p>
            </div>
            <div className="value-card">
              <h3>🤝 Comunidad</h3>
              <p>MonkiBox es un punto de encuentro. Nos encanta ver tus unboxings y compartir la emoción contigo en nuestras redes.</p>
            </div>
          </div>
        </section>

        {/* Sección de Llamada a la Acción (CTA) */}
        <section className="nosotros-section cta-section">
          <h2>¿Listo para tu próxima aventura?</h2>
          <p>
            ¡Explora nuestro catálogo y encuentra tu próximo tesoro!
          </p>
          <Link to="/productos" className="nosotros-cta-btn">
            Ver Productos
          </Link>
        </section>

      </div>
    </TiendaLayout>
  );
};

export default NosotrosPage;