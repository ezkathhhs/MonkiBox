import React from 'react';
import './SuccessToast.css';

// 'isVisible' controlará si se muestra
const SuccessToast = ({ message, isVisible }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="success-toast">
      {message}
    </div>
  );
};

export default SuccessToast;