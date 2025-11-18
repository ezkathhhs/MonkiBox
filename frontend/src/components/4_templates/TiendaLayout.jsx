import React from 'react';
import TiendaNavbar from './TiendaNavbar';
import TiendaSubnav from './TiendaSubnav';
import './TiendaLayout.css'; // Contiene el footer

const TiendaLayout = ({ children }) => {
  return (
    <div className="wrapper">
      <header className="sticky-header">
        <TiendaNavbar />
        <TiendaSubnav />
      </header>
      
      <main className="tienda-container">
        {children}
      </main>

      <footer>
        <p>
          &copy; 2025 MonkiBox. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default TiendaLayout;