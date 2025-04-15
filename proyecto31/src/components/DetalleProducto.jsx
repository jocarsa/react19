// frontend/src/components/DetalleProducto.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function DetalleProducto({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    // Cargar producto desde el backend
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) {
    return <p>Cargando producto...</p>;
  }

  const handleAddToCart = () => {
    onAddToCart(product, parseInt(cantidad));
    alert(`${product.name} se agregó al carrito.`);
  };

  return (
    <section>
      <button onClick={() => navigate('/')}>← Volver a Productos</button>
      <div id="product-details">
        <img src={product.image} alt={product.name} />
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>Precio: ${product.price.toFixed(2)}</p>
        <label htmlFor="quantity">Cantidad: </label>
        <input
          type="number"
          id="quantity"
          value={cantidad}
          min="1"
          onChange={(e) => setCantidad(e.target.value)}
        />
        <button onClick={handleAddToCart}>Agregar al Carrito</button>
      </div>
    </section>
  );
}

export default DetalleProducto;
