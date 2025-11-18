import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; // 1. IMPORTAR HOOK DEL CARRITO
import Button from '../1_atoms/Button'; // 2. IMPORTAR EL BOTÓN
import './ProductCard.css'; // Importamos nuestro CSS

// Función para formatear el precio (se mantiene)
const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(price);
};

// Define el umbral para "pocas existencias"
const LOW_STOCK_THRESHOLD = 10;

const ProductCard = ({ product }) => {
  // 3. OBTENER FUNCIÓN DEL CARRITO
  const { addToCart } = useCart();
  
  const { 
    product_id, 
    name, 
    image_url, 
    price,
    old_price,
    discount_percentage,
    stock // Necesitamos el stock
  } = product;

  // 4. LÓGICA DE STOCK PARA LA PÍLDORA
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= LOW_STOCK_THRESHOLD;
  const isAvailable = stock > 0;

  // 5. MANEJADOR DEL BOTÓN
  // ¡Importante! Usamos e.preventDefault() para que al hacer clic en el botón,
  // NO se active el Link de la tarjeta y nos lleve a la página de detalle.
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    // (Opcional: podrías añadir un toast de "Añadido")
  };

  return (
    // La tarjeta es un Link
    <Link to={`/producto/${product_id}`} className="product-card">
      
      {/* 1. CAJA DE IMAGEN */}
      <div className="card-image-box">
        <img 
          src={image_url || '/mono.jpg'}
          alt={name} 
          className="card-image"
        />
        
        {/* --- 6. PÍLDORA DE STOCK (AÑADIDA) --- */}
        {isAvailable && (
          <span className={`stock-pill ${isLowStock ? 'low-stock' : 'in-stock'}`}>
            {isLowStock ? `¡${stock} pzs disponibles!` : '¡Llévatelo ahora!'}
          </span>
        )}
        {isOutOfStock && (
          <span className="stock-pill out-of-stock">Agotado</span>
        )}
      </div>

      {/* 2. CAJA DE INFORMACIÓN */}
      <div className="card-info-box">
        {isAvailable && (
          <span className={`stock-pill ${isLowStock ? 'low-stock' : 'in-stock'}`}>
            {isLowStock ? `¡${stock} pzs disponibles!` : '¡Llévatelo ahora!'}
          </span>
        )}
        {isOutOfStock && (
          <span className="stock-pill out-of-stock">Agotado</span>
        )}
        <h3 className="card-name">{name}</h3>
        
        {/* 3. CONTENEDOR DE PRECIO (Se mantiene igual) */}
        <div className="price-container">
          {discount_percentage > 0 && old_price ? (
            <div className="offer-price">
              <span className="old-price">{formatPrice(old_price)}</span>
              <div className="offer-line">
                <span className="new-price">{formatPrice(price)}</span>
                <span className="discount-tag">{discount_percentage}% OFF</span>
              </div>
            </div>
          ) : (
            <span className="normal-price">{formatPrice(price)}</span>
          )}
        </div>
        
        {/* --- 7. BOTÓN DE AÑADIR (AÑADIDO) --- */}
        {/* Este wrapper ayuda a empujar el botón al fondo */}
        <div className="card-button-wrapper">
          <Button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Agotado' : 'Añadir al Carrito'}
          </Button>
        </div>

      </div>
    </Link>
  );
};

export default ProductCard;