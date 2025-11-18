import React, { useState } from 'react';
import TiendaLayout from '../components/4_templates/TiendaLayout';
import Modal from '../components/2_molecules/Modal'; // ¡Reutilizamos el Modal!
import BlogCard from '../components/2_molecules/BlogCard';
import './BlogsPage.css';

// 1. Aquí está el contenido de las noticias
const blogPosts = [
  {
    id: 1,
    title: 'El Fenómeno de las Blind Boxes: ¿Por qué amamos la sorpresa?',
    excerpt: 'Explora la psicología detrás del unboxing, la emoción de la "caza" del artículo chase...',
    content: 'La psicología detrás del fenómeno de las "cajas c ciegas" o blind boxes es fascinante. Se basa en el principio de recompensa variable, similar al de las máquinas tragamonedas. La emoción no viene solo de obtener el producto, sino de la anticipación de *lo que podría ser*. Cada apertura es una pequeña apuesta. A esto se suma el coleccionismo: la búsqueda de la figura "chase" (la más rara de la serie) crea una comunidad de entusiastas que intercambian, venden y comparten sus hallazgos, convirtiendo un simple juguete en un hobby social y emocionante.',
    image: 'https://img4.dhresource.com/webp/m/0x0/f3/albu/ys/l/04/56bfe46e-2be7-433f-8e2b-8e96b7560e2c.jpg'
  },
  {
    id: 2,
    title: 'Las 5 Colaboraciones de MonkiBox que no te puedes perder',
    excerpt: '¡Este año viene cargado! Anunciamos colaboraciones exclusivas con artistas de renombre...',
    content: 'En MonkiBox, creemos en llevar el arte a tus manos. Por eso, este año nos hemos asociado con cinco artistas emergentes para crear series de edición limitada. \n\n1. **Monitos Cósmicos:** Una visión interestelar de nuestro mono insignia. \n2. **Criaturas Míticas:** Adorables dragones, fénix y unicornios. \n3. **Sabores del Mundo:** Figuras con temática de comidas internacionales. \n4. **Leyendas Urbanas:** Un toque misterioso y divertido. \n5. **Colaboración Secreta:** ¡Una marca icónica que revelaremos en diciembre! \n\n¡Prepárate para coleccionarlas todas!',
    image: 'https://blob.lacaderadeeva.com/images/2025/08/21/labubus-focus-0-0-1260-1050.webp'
  },
  // ... (En el futuro, puedes añadir más posts aquí)
];

const BlogsPage = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);

  const openModal = (post) => setSelectedBlog(post);
  const closeModal = () => setSelectedBlog(null);

  return (
    <TiendaLayout>
      <div className="blogs-page-container">
        <header className="blogs-header">
          <h1>Nuestro Blog</h1>
          <p>Las últimas noticias, lanzamientos y vistazos al mundo de MonkiBox.</p>
        </header>

        {/* Esta cuadrícula será 'scrollable' automáticamente si añades más posts */}
        <div className="blogs-grid">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} onClick={() => openModal(post)} />
          ))}
        </div>
      </div>

      {/* 2. El Modal que se abre */}
      <Modal isOpen={!!selectedBlog} onClose={closeModal} title={selectedBlog?.title}>
        {selectedBlog && (
          <div className="blog-modal-content">
            <img src={selectedBlog.image} alt={selectedBlog.title} className="blog-modal-image" />
            {/* Usamos 'whiteSpace' para respetar los saltos de línea del texto */}
            <p style={{ whiteSpace: 'pre-wrap' }}>
              {selectedBlog.content}
            </p>
          </div>
        )}
      </Modal>
    </TiendaLayout>
  );
};

export default BlogsPage;