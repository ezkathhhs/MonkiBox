import React from 'react';
import { useCart } from '../../context/CartContext';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity > 0) {
      updateQuantity(item.product.product_id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.product.product_id);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  };

  return (
    <div className="cart-item">
      <div className="cart-item-image-wrapper">
        <img src={item.product.image_url || '/mono.jpg'} alt={item.product.name} />
      </div>
      <div className="cart-item-details">
        <h3>{item.product.name}</h3>
        <span className="cart-item-price">{formatPrice(item.product.price)}</span>
      </div>
      <div className="cart-item-quantity">
        <label>Cantidad:</label>
        <input 
          type="number" 
          value={item.quantity} 
          onChange={handleQuantityChange}
          min="1"
          max={item.product.stock}
        />
      </div>
      <button onClick={handleRemove} className="cart-item-remove-btn">
        Eliminar
      </button>
    </div>
  );
};

export default CartItem;