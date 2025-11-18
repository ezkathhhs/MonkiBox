import React from 'react';
import { Link } from 'react-router-dom';
import TiendaLayout from '../components/4_templates/TiendaLayout';
import './CategoriasPage.css';

const categories = [
  {
    id: 'BlindBox',
    title: 'Blind Boxes',
    description: 'La emoción de lo desconocido. ¡Colecciónalos todos!',
    // Usamos un color de fondo diferente para cada uno para darle vida
    color: '#FF9AA2', 
    image: 'https://www.switts.com.sg/wp-content/uploads/2025/05/Group-101437-scaled.png'
  },
  {
    id: 'Peluche',
    title: 'Peluches',
    description: 'Suaves, adorables y listos para abrazar.',
    color: '#FFB7B2',
    image: 'https://f.rpp-noticias.io/2024/12/03/011001_1676880.jpg?width=1020&quality=80'
  },
  {
    id: 'Llavero',
    title: 'Llaveros',
    description: 'Lleva a tus personajes favoritos a todas partes.',
    color: '#FFDAC1',
    image: 'https://i.pinimg.com/originals/bc/29/7f/bc297f42dbdadd8364dc77e22875406c.jpg'
  }
];

const CategoriasPage = () => {
  return (
    <TiendaLayout>
      <div className="categories-container">
        <header className="categories-header">
          <h1>Explora nuestras Colecciones</h1>
          <p>Encuentra el regalo perfecto o completa tu colección personal.</p>
        </header>

        <div className="categories-grid">
          {categories.map((cat) => (
            <Link 
              to={`/categoria/${cat.id}`} 
              key={cat.id} 
              className="category-card"
              style={{ '--hover-color': cat.color }} // Variable CSS dinámica
            >
              <div className="category-image-wrapper">
                <img src={cat.image} alt={cat.title} />
                <div className="category-overlay">
                  <span>Ver Productos</span>
                </div>
              </div>
              <div className="category-content">
                <h2>{cat.title}</h2>
                <p>{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </TiendaLayout>
  );
};

export default CategoriasPage;