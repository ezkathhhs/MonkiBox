import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Usamos react-icons
import './ImageCarousel.css';

// Lista de imágenes para el carrusel
const slides = [
  {
    url: 'https://static01.nyt.com/images/2025/05/01/espanol/27ST-LABUBU-DOLLS-GROUP-ES-copy1/27ST-LABUBU-DOLLS-GROUP-videoSixteenByNine3000.jpg',
    title: 'Nuevos Lanzamientos',
    description: 'Descubre los últimos coleccionables.'
  },
  {
    url: 'https://cdnx.jumpseller.com/very-cute/image/58937646/KP005401_1.jpg?1736382872',
    title: 'Ofertas Especiales',
    description: '¡Descuentos en tus peluches favoritos!'
  },
  {
    url: 'https://images.squarespace-cdn.com/content/v1/616632df4479e534656ecf49/400e9b84-8635-48f0-b0b2-59dc331ad882/BlindBox.jpg',
    title: 'Categoría BlindBox',
    description: 'La emoción de no saber qué tocará.'
  },
];

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="carousel-container">
      <div className="slide-wrapper" 
           style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {slides.map((slide, index) => (
          <div className="slide" key={index} style={{ backgroundImage: `url(${slide.url})` }}>
            <div className="slide-content">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Flechas */}
      <div className="arrow left-arrow" onClick={prevSlide}><FaChevronLeft /></div>
      <div className="arrow right-arrow" onClick={nextSlide}><FaChevronRight /></div>

      {/* Puntos (Dots) */}
      <div className="dots-container">
        {slides.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            className={`dot ${currentIndex === slideIndex ? 'active' : ''}`}
            onClick={() => goToSlide(slideIndex)}
          >
            ●
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;