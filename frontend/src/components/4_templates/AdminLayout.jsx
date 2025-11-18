import React from 'react';
import { Link } from 'react-router-dom';
import './AdminLayout.css';

// 'children' es una prop especial en React.
// Representará el contenido de la página (ej. el dashboard, la lista de usuarios, etc.)
const AdminLayout = ({ children }) => {
  return (
    <div className="wrapper">
      <div className="sticky-header">
        <nav className="navbar">
          {/* El logo ahora es un Link a la página principal de la tienda */}
          <Link to="/" className="logo">
            <span className="logo-text">🛍️ MonkiBox 🛍️</span>
          </Link>
        </nav>
        
        <div className="subnav">
          <div className="subnav-links">
            {/* Convertimos todos los 'a' en 'Link' para navegación en React */}
            <Link to="/dashboard">Inicio</Link>
            <Link to="/dashboard/usuarios">Usuarios</Link>
            <Link to="/dashboard/productos">Productos</Link>
            <Link to="/dashboard/ordenes">Pedidos</Link> {/* Actualizado de 'Pedidos' a 'Ordenes' como en tu diagrama */}
            <Link to="/dashboard/reportes">Reportes</Link>
            <Link to="/dashboard/perfil">Perfil</Link>
          </div>
        </div>
      </div>

      {/* Aquí es donde se renderizará el contenido de cada página.
        (Ej. el contenido de AdminDashboardPage)
      */}
      <main className="admin-container">
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

export default AdminLayout;