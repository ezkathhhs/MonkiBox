import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Importamos nuestro hook
import { useCart } from '../../context/CartContext';
import './TiendaNavbar.css';

const TiendaNavbar = () => {
  // Obtenemos el usuario y la función de logout del contexto
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar-tienda">
      <Link to="/" className="logo">
        <span className="logo-text">🛍️ MonkiBox 🛍️</span>
      </Link>
      
      <div className="navbar-tienda-links">
        {user ? (
          // --- VISTA LOGEADO ---
          <div className="user-info-section">
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
            </div>
            <button onClick={logout} className="nav-btn-logout">
              Cerrar Sesión
            </button>
          </div>
        ) : (
          // --- VISTA DESCONECTADO ---
          <div className="auth-buttons">
            <Link to="/login" className="nav-btn-tienda">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="nav-btn-tienda primary">
              Crear Cuenta
            </Link>
          </div>
        )}

        {/* El botón del carrito se mantiene */}
        <Link to="/carrito" className="nav-btn" id="cartLink">
          🛒(<span id="cartCount">{totalItemCount}</span>)
        </Link>
      </div>
    </nav>
  );
};

export default TiendaNavbar;