import React, { createContext, useState, useContext } from 'react';
import SuccessToast from '../components/1_atoms/SuccessToast';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState('');

  const triggerToast = (message) => {
    setMsg(message);
    setShow(true);
    setTimeout(() => setShow(false), 3000);
  };

  return (
    <ToastContext.Provider value={{ triggerToast }}>
      {children}
      {/* La alerta vive AQUÍ, en la capa superior, lejos de las tarjetas */}
      <SuccessToast message={msg} isVisible={show} />
    </ToastContext.Provider>
  );
};