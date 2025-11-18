import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { regiones, comunas } from '../utils/chilean_locations';
import TiendaLayout from '../components/4_templates/TiendaLayout';
import OrderSuccessModal from '../components/3_organisms/OrderSuccessModal';
import Button from '../components/1_atoms/Button';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  // --- ESTADOS ---
  // 1. Info de Usuario
  const [userInfo, setUserInfo] = useState({
    id: user ? user.user_id : null,
    name: user ? user.name : '',
    email: user ? user.email : '',
  });

  // 2. Info de Envío
  const [shippingDetails, setShippingDetails] = useState({
    calle: '',
    depto: '',
    region: 'Región Metropolitana de Santiago',
    comuna: 'Santiago',
    indicaciones: '',
  });
  
  // 3. Estado de la página
  const [comunasList, setComunasList] = useState(comunas['Región Metropolitana de Santiago']);
  const [completedOrder, setCompletedOrder] = useState(null); // Para la boleta

  // --- CÁLCULOS ---
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = 6780; // Fijo por ahora
  const total = subtotal + shipping;
  const totals = { subtotal, shipping, total };

  // --- EFECTOS ---
  // Autofill si el usuario inicia sesión
  useEffect(() => {
    if (user) {
      setUserInfo({ id: user.user_id, name: user.name, email: user.email });
    }
  }, [user]);

  // Actualizar lista de comunas cuando cambia la región
  useEffect(() => {
    setComunasList(comunas[shippingDetails.region] || []);
    // Resetea la comuna seleccionada
    setShippingDetails(prev => ({
      ...prev,
      comuna: comunas[shippingDetails.region]?.[0] || ''
    }));
  }, [shippingDetails.region]);

  // --- MANEJADORES ---
  const handleUserChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };
  
  const handleShippingChange = (e) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  // --- SUBMIT (PAGAR) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    // 1. Crear el objeto de la orden
    const orderToCreate = {
      userInfo,
      shippingDetails,
      cartItems,
      totals,
    };

    try {
      // 2. Enviar al backend
      const response = await api.post('/orders', orderToCreate);
      
      // 3. Mostrar boleta
      setCompletedOrder(response.data);
      
      // 4. Limpiar el carrito
      clearCart();
    } catch (error) {
      console.error("Error al crear la orden:", error);
      alert("Hubo un error al procesar tu pago. Por favor, intenta de nuevo.");
    }
  };

  // Función para cerrar el modal y volver al inicio
  const handleCloseModal = () => {
    setCompletedOrder(null);
    navigate('/');
  };
  
  // Formateador de precio
  const formatPrice = (price) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);

  return (
    <TiendaLayout>
      <div className="checkout-container">
        <h1>Finalizar Compra</h1>
        
        {/* Formulario que envuelve las 2 columnas */}
        <form className="checkout-grid" onSubmit={handleSubmit}>
          
          {/* --- COLUMNA IZQUIERDA: FORMULARIOS --- */}
          <div className="checkout-forms">
            
            {/* 1. Información del Cliente */}
            <div className="form-section">
              <h2>Información del Cliente</h2>
              <div className="form-field">
                <label htmlFor="name">Nombre*</label>
                <input type="text" id="name" name="name" value={userInfo.name} onChange={handleUserChange} required disabled={!!user} />
              </div>
              <div className="form-field">
                <label htmlFor="email">Correo Electrónico*</label>
                <input type="email" id="email" name="email" value={userInfo.email} onChange={handleUserChange} required disabled={!!user} />
              </div>
            </div>

            {/* 2. Dirección de Entrega (tu imagen) */}
            <div className="form-section">
              <h2>Dirección de entrega de los productos</h2>
              <p>Ingrese dirección de forma detallada</p>
              
              <div className="form-grid-2">
                <div className="form-field">
                  <label htmlFor="calle">Calle*</label>
                  <input type="text" id="calle" name="calle" value={shippingDetails.calle} onChange={handleShippingChange} required />
                </div>
                <div className="form-field">
                  <label htmlFor="depto">Departamento (opcional)</label>
                  <input type="text" id="depto" name="depto" value={shippingDetails.depto} onChange={handleShippingChange} placeholder="Ej: 603" />
                </div>
              </div>
              <div className="form-grid-2">
                <div className="form-field">
                  <label htmlFor="region">Región*</label>
                  <select id="region" name="region" value={shippingDetails.region} onChange={handleShippingChange} required>
                    {regiones.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="comuna">Comuna*</label>
                  <select id="comuna" name="comuna" value={shippingDetails.comuna} onChange={handleShippingChange} required>
                    {comunasList.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="indicaciones">Indicaciones para la entrega (opcional)</label>
                <textarea id="indicaciones" name="indicaciones" value={shippingDetails.indicaciones} onChange={handleShippingChange} placeholder="Ej: Entre calles, color del edificio, no tiene timbre." />
              </div>
            </div>
          </div>
          
          {/* --- COLUMNA DERECHA: RESUMEN Y PRODUCTOS --- */}
          <div className="checkout-summary">
            <div className="summary-card">
              
              {/* 1. Resumen de Compra (tu imagen) */}
              <h2>Resumen de Compra</h2>
              <div className="summary-row"><span>Subtotal:</span> <span>{formatPrice(subtotal)}</span></div>
              <div className="summary-row"><span>Envío:</span> <span>{formatPrice(shipping)}</span></div>
              <div className="summary-row discount"><span>Descuento:</span> <span>-{formatPrice(0)}</span></div>
              <div className="summary-row total"><strong>Total:</strong> <strong>{formatPrice(total)}</strong></div>
              
              {/* 2. Botón de Pagar */}
              <Button type="submit" className="checkout-btn">Pagar ahora</Button>
              
              {/* 3. Lista de Productos (debajo del resumen) */}
              <div className="checkout-product-list">
                <h3>Tus Productos</h3>
                {cartItems.map(item => (
                  <div className="checkout-product-item" key={item.product.product_id}>
                    <img src={item.product.image_url || '/mono.jpg'} alt={item.product.name} />
                    <div className="item-info">
                      <p>{item.product.name} (x{item.quantity})</p>
                      {item.product.old_price && (
                        <span className="item-old-price">{formatPrice(item.product.old_price)}</span>
                      )}
                      <span className="item-price">{formatPrice(item.product.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
              
            </div>
          </div>
        </form>
      </div>
      
      {/* El Modal de la Boleta */}
      <OrderSuccessModal orderData={completedOrder} onClose={handleCloseModal} />
    </TiendaLayout>
  );
};

export default CheckoutPage;