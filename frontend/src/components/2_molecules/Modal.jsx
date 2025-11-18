import React from 'react';
import './Modal.css';

// 'isOpen' controla si se ve o no
// 'onClose' es la función que se llama al cerrar (ej. con la 'X')
// 'title' es el título de la ventana
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        <div className="modal-body">
          {children} {/* Aquí irá nuestro formulario */}
        </div>
      </div>
    </div>
  );
};

export default Modal;