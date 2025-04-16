// frontend/src/components/Encabezado.js
import React from 'react';
import { Link } from 'react-router-dom';

function Encabezado({ cartCount }) {
  return (
    <header>
      <h1>Ecommerce Simple</h1>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/checkout">Pagar (<span>{cartCount}</span>)</Link>
      </nav>
    </header>
  );
}

export default Encabezado;
