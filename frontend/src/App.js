import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Páginas Públicas
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TiendaHomePage from './pages/TiendaHomePage'; 
import ProductosPage from './pages/ProductosPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoriasPage from './pages/CategoriasPage';
import CategoryProductsPage from './pages/CategoryProductsPage';
import OfertasPage from './pages/OfertasPage';
import NosotrosPage from './pages/NosotrosPage';
import BlogsPage from './pages/BlogsPage';
import ContactoPage from './pages/ContactoPage';
import CarritoPage from './pages/CarritoPage';
import CheckoutPage from './pages/CheckoutPage';

// Páginas de Admin
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUserPage from './pages/AdminUserPage';
import AdminProductPage from './pages/AdminProductPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminReportPage from './pages/AdminReportPage';
import AdminProfilePage from './pages/AdminProfilePage';

import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* --- RUTAS DE LA TIENDA --- */}
              <Route path="/" element={<TiendaHomePage />} />

              <Route path="/productos" element={<ProductosPage />} />
              <Route path="/producto/:id" element={<ProductDetailPage />} />
              <Route path="/categorias" element={<CategoriasPage />} />
              <Route path="/categoria/:categoryName" element={<CategoryProductsPage />} />
              <Route path="/ofertas" element={<OfertasPage />} />
              <Route path="/nosotros" element={<NosotrosPage />} />
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/contacto" element={<ContactoPage />} />
              <Route path="/carrito" element={<CarritoPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              

              {/* --- RUTAS DE AUTENTICACIÓN --- */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* --- RUTAS DE ADMIN --- */}
              <Route path="/dashboard" element={<AdminDashboardPage />} />
              <Route path="/dashboard/usuarios" element={<AdminUserPage />} />
              <Route path="/dashboard/productos" element={<AdminProductPage />} />
              <Route path="/dashboard/ordenes" element={<AdminOrdersPage />} />
              <Route path="/dashboard/reportes" element={<AdminReportPage />} />
              <Route path="/dashboard/perfil" element={<AdminProfilePage />} /> 
              
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;