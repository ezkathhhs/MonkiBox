import React, { useState, useEffect } from 'react'; // 1. Importamos hooks
import axios from 'axios'; // 2. Importamos axios
import AdminLayout from '../components/4_templates/AdminLayout';
import QuickActionGrid from '../components/3_organisms/QuickActionGrid';
import './AdminDashboardPage.css';

// 3. Definimos la URL de la API
const API_URL = 'http://localhost:4000/api';

const AdminDashboardPage = () => {
  
  // 4. Creamos un estado para guardar los números
  // Usamos '...' como indicador de carga
  const [stats, setStats] = useState({
    products: '...',
    users: '...',
    orders: '...'
  });

  // 5. Usamos useEffect para cargar los datos al montar la página
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/stats/summary`);
        setStats(response.data); // Guardamos los números de la API
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
        setStats({ products: 'Error', users: 'Error', orders: 'Error' });
      }
    };

    fetchStats();
  }, []); // El array vacío [] significa que esto se ejecuta solo una vez

  return (
    <AdminLayout>
      {/* Tu diseño se mantiene 100% igual */}
      <div className="welcome-card">
        <h1>¡Bienvenido al Panel de Administración!</h1>
        <p>Desde aquí puedes gestionar todos los aspectos de tu tienda online. Utiliza el menú de navegación para acceder a las diferentes secciones.</p>
        
        <div className="admin-stats">
          
          {/* 6. Conectamos los números del estado */}
          <div className="stat-card">
            <h3>Total de Productos</h3>
            <div className="stat-number" id="total-products">
              {stats.products}
            </div>
          </div>
          
          <div className="stat-card">
            <h3>Total de Usuarios</h3>
            <div className="stat-number" id="total-users">
              {stats.users}
            </div>
          </div>
          
          <div className="stat-card">
            {/* Hacemos el título un poco más claro */}
            <h3>Total de Compras</h3>
            <div className="stat-number" id="today-orders">
              {stats.orders}
            </div>
          </div>

        </div>
      </div>
      
      <QuickActionGrid />
      
    </AdminLayout>
  );
};

export default AdminDashboardPage;