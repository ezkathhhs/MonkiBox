import React from 'react';
import { Link } from 'react-router-dom';
import './TiendaSubnav.css';

const TiendaSubnav = () => {
  return (
    <div className="subnav-tienda">
      <div className="subnav-tienda-links">
        <Link to="/productos">Productos</Link>
        <Link to="/categorias">Categorías</Link>
        <Link to="/ofertas">Ofertas</Link>
        <Link to="/nosotros">Nosotros</Link>
        <Link to="/blogs">Blogs</Link>
        <Link to="/contacto">Contacto</Link>
      </div>
    </div>
  );
};

export default TiendaSubnav;