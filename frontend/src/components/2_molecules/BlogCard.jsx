import React from 'react';
import './BlogCard.css';

// Recibe el 'post' y la función 'onClick'
const BlogCard = ({ post, onClick }) => {
  return (
    <div className="blog-card" onClick={onClick}>
      <div className="blog-card-image-wrapper">
        <img src={post.image} alt={post.title} />
      </div>
      <div className="blog-card-content">
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <span className="read-more-link">Leer más...</span>
      </div>
    </div>
  );
};

export default BlogCard;