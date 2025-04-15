// frontend/src/components/ListaProductos.js
import React from 'react';
import { Link } from 'react-router-dom';

function ListaProductos({ products }) {
  return (
    <section>
      <h2>Productos</h2>
      <div className="grid">
        {products.map((product) => (
          <Link 
            key={product._id} 
            to={`/producto/${product._id}`} 
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.price.toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default ListaProductos;
