import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    // Fondo oscuro que cierra el modal al hacer clic
    <div className="confirmation-backdrop" onClick={onCancel}>
      
      {/* Detenemos la propagación para que no se cierre al hacer clic en la burbuja */}
      <div className="confirmation-bubble" onClick={(e) => e.stopPropagation()}>
        <p>¿Estas seguro?</p>
        <div className="confirmation-buttons">
          <button onClick={onCancel} className="btn-no">No</button>
          <button onClick={onConfirm} className="btn-yes">Si</button>
        </div>
      </div>
      
    </div>
  );
};

export default ConfirmationModal;