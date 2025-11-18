import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import TiendaLayout from '../components/4_templates/TiendaLayout';
import CartItem from '../components/3_organisms/CartItem';
import CartSummary from '../components/3_organisms/CartSummary';
import './CarritoPage.css';

const CarritoPage = () => {
  const { cartItems } = useCart();

  return (
    <TiendaLayout>
      {/* Centramos el contenido como pediste */}
      <div className="carrito-container">
        <h1>Mi Carrito de Compras</h1>
        
        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <p>Tu carrito está vacío.</p>
            <Link to="/productos" className="atomic-button">
              Ver Productos
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-list">
              {cartItems.map(item => (
                <CartItem key={item.product.product_id} item={item} />
              ))}
            </div>
            <div className="cart-summary-wrapper">
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </TiendaLayout>
  );
};

export default CarritoPage;