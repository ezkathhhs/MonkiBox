import React from 'react';
import './OrderSuccessModal.css';

const OrderSuccessModal = ({ orderData, onClose, isOpen }) => {
  if (!isOpen || !orderData) return null;

  const { order, items } = orderData;
  const { shipping_address } = order;

  // Formateador de precio
  const formatPrice = (price) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);

  return (
    <div className="modal-backdrop">
      <div className="order-success-modal">
        {/* Tu "X" roja para cerrar/simular fallo */}
        <button onClick={onClose} className="modal-close-btn fail-sim">
          &times;
        </button>
        
        <header className="order-success-header">
          <h2>¡Compra realizada con éxito!</h2>
          <p>Orden N°: <strong>{order.order_id}</strong></p>
        </header>

        <section className="order-details-section">
          <h3>Información del Cliente</h3>
          <p>{order.customer_name}</p>
          <p>{order.customer_email}</p>
        </section>

        <section className="order-details-section">
          <h3>Dirección de Entrega</h3>
          <p>{shipping_address.calle} {shipping_address.depto || ''}</p>
          <p>{shipping_address.comuna}, {shipping_address.region}</p>
          <p><em>{shipping_address.indicaciones || 'Sin indicaciones.'}</em></p>
        </section>

        <section className="order-details-section">
          <h3>Productos Comprados</h3>
          <ul className="order-product-list">
            {items.map(item => (
              <li key={item.item_id}>
                <span>{item.product_name} (x{item.quantity})</span>
                <span>{formatPrice(item.price_at_purchase * item.quantity)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="order-total-summary">
          <div className="summary-row"><span>Subtotal:</span> <span>{formatPrice(order.subtotal)}</span></div>
          <div className="summary-row"><span>Envío:</span> <span>{formatPrice(order.shipping_cost)}</span></div>
          <div className="summary-row total">
            <strong>Total Pagado:</strong> 
            <strong>{formatPrice(order.total_amount)}</strong>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrderSuccessModal;