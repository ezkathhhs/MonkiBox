import React from 'react';
import { useCart } from '../../context/CartContext';
import Button from '../1_atoms/Button';
import './CartSummary.css';
import { useNavigate } from 'react-router-dom';

const CartSummary = () => {
  const { cartItems } = useCart();

  // --- Cálculos ---
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const envio = 6780; // Hardcodeado como en tu imagen
  const descuento = 0; // Hardcodeado por ahora
  const total = subtotal + envio - descuento;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  };

  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-summary">
      <h2>Resumen de Compra</h2>
      
      <div className="summary-row">
        <span>Subtotal:</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="summary-row">
        <span>Envío:</span>
        <span>{formatPrice(envio)}</span>
      </div>
      <div className="summary-row discount">
        <span>Descuento:</span>
        <span>-{formatPrice(descuento)}</span>
      </div>
      <div className="summary-row total">
        <strong>Total:</strong>
        <strong>{formatPrice(total)}</strong>
      </div>
      
      <div className="coupon-section">
        <label htmlFor="coupon">¿Tienes un cupón?</label>
        <div className="coupon-input">
          <input type="text" id="coupon" placeholder="Ingresa tu código" />
          <button type="button">Aplicar</button>
        </div>
      </div>
      
      {/* Botón (reutilizamos Button pero con estilo propio) */}
      <Button className="checkout-btn" onClick={handleCheckout}>
        Proceder al Pago
      </Button>
    </div>
  );
};

export default CartSummary;