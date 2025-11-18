import React, { useState } from 'react';
import './UserTable.css';

// Recibimos la lista de usuarios y las funciones que se ejecutarán
const UserTable = ({ users, onEdit, onHistory, onDelete }) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const toggleDropdown = (userId) => {
    if (openDropdownId === userId) {
      setOpenDropdownId(null); // Cierra si ya está abierto
    } else {
      setOpenDropdownId(userId); // Abre el de este ID
    }
  };

  // Formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo Electrónico</th>
            <th>Rol</th>
            <th>Fecha de Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{formatDate(user.created_at)}</td>
              <td className="actions-cell">
                <button onClick={() => toggleDropdown(user.user_id)} className="dots-btn">
                  ⋮
                </button>
                
                {/* Menú desplegable */}
                {openDropdownId === user.user_id && (
                  <div className="dropdown-menu">
                    <button onClick={() => { onEdit(user); setOpenDropdownId(null); }}>
                      Modificar
                    </button>
                    <button onClick={() => { onHistory(user); setOpenDropdownId(null); }}>
                      Historial
                    </button>
                    <button onClick={() => { onDelete(user.user_id); setOpenDropdownId(null); }} className="delete">
                      Eliminar
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;