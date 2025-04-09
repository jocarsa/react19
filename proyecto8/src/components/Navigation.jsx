// src/components/Navigation.jsx
import React from 'react';

const Navigation = ({ onNavigate }) => {
  return (
    <nav>
      <button onClick={() => onNavigate('inicio')}>Inicio</button>
      <button onClick={() => onNavigate('quiensoy')}>Quien soy</button>
      <button onClick={() => onNavigate('proyectos')}>Proyectos</button>
    </nav>
  );
};

export default Navigation;
