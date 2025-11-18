import React from 'react';
import ProductCard from '../2_molecules/ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ products }) => {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;