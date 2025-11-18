import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import TiendaLayout from '../components/4_templates/TiendaLayout';
import ProductGrid from '../components/3_organisms/ProductGrid';
import SuccessToast from '../components/1_atoms/SuccessToast';
import Button from '../components/1_atoms/Button';
import { useCart } from '../context/CartContext';
import './ProductDetailPage.css';

const API_URL = 'http://localhost:4000/api';

const ProductDetailPage = () => { 
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const productPromise = axios.get(`${API_URL}/products/${id}`);
        const relatedPromise = axios.get(`${API_URL}/related-products/${id}`);
        
        const [productResponse, relatedResponse] = await Promise.all([
          productPromise,
          relatedPromise
        ]);

        setProduct(productResponse.data);
        setRelatedProducts(relatedResponse.data);
      } catch (err) {
        setError('Error al cargar la información del producto.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addToCart(product, quantity); // Añade el producto y cantidad al contexto
      
      // Mostrar notificación
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    }
  };

  if (loading) {
    return <TiendaLayout><p className="product-detail-message">Cargando...</p></TiendaLayout>;
  }
  if (error) {
    return <TiendaLayout><p className="product-detail-message error">{error}</p></TiendaLayout>;
  }
  if (!product) {
    return <TiendaLayout><p className="product-detail-message">Producto no encontrado.</p></TiendaLayout>;
  }

  return (
    <TiendaLayout>
      <div className="product-detail-container">
        <div className="breadcrumbs">
          <Link to="/">Home</Link> / 
          <Link to="/productos">Productos</Link> / 
          <span>{product.name}</span>
        </div>

        <div className="main-content">
          
          {/* Columna Izquierda: Imagen (sin thumbnails) */}
          <div className="product-images">
            <div className="main-image-container">
              <img 
                src={product.image_url || '/mono.jpg'} 
                alt={product.name} 
                className="main-image"
              />
            </div>
            {/* --- THUMBNAILS ELIMINADOS --- */}
          </div>
          
          {/* Columna Derecha: Información y Acciones */}
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            <span className="product-price">{formatPrice(product.price)}</span>
            <p className="product-description">{product.description}</p>
            
            <div className="product-actions">
              <div className="quantity-selector">
                <label htmlFor="quantity">Cantidad:</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, e.target.value))}
                  min="1"
                  max={product.stock}
                />
              </div>
              <Button type="button" className="add-to-cart-btn" onClick={handleAddToCart}>
                Añadir al carrito
              </Button>
            </div>
          </div>  
        </div>

        {/* Sección de Productos Relacionados */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h2>Productos Relacionados</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}

      </div>

      <SuccessToast 
        message="¡Producto añadido al carrito!" 
        isVisible={toastVisible} 
      />
      
    </TiendaLayout>
  );
};

export default ProductDetailPage;