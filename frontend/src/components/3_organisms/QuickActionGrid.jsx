import React from 'react';
// Importamos los iconos que necesitamos de 'react-icons'
import { BsFillBoxSeamFill, BsPeopleFill, BsClipboardDataFill } from 'react-icons/bs';
import { FaFileInvoiceDollar } from "react-icons/fa";
import QuickActionCard from '../2_molecules/QuickActionCard';
import './QuickActionGrid.css';

const QuickActionGrid = () => {
  // Basado en tu diagrama de admin y la imagen
  const actions = [
    {
      icon: <BsFillBoxSeamFill />,
      title: 'Productos',
      description: 'Administrar inventario y detalles de los productos.',
      to: '/dashboard/productos',
    },
    {
      icon: <BsPeopleFill />,
      title: 'Usuarios',
      description: 'Gestión de cuentas de usuario y sus roles.',
      to: '/dashboard/usuarios',
    },
    {
      icon: <FaFileInvoiceDollar />,
      title: 'Órdenes',
      description: 'Gestión y seguimiento de todas las órdenes de compra.',
      to: '/dashboard/ordenes',
    },
    {
      icon: <BsClipboardDataFill />,
      title: 'Reportes',
      description: 'Generación de informes detallados sobre las operaciones.',
      to: '/dashboard/reportes',
    },
  ];

  return (
    <div className="quick-actions">
      <h2>Acciones Rápidas</h2>
      <div className="quick-action-grid">
        {actions.map((action) => (
          <QuickActionCard
            key={action.title}
            icon={action.icon}
            title={action.title}
            description={action.description}
            to={action.to}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickActionGrid;