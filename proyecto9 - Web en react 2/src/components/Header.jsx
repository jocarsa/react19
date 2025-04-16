// src/components/Header.jsx
import React from 'react';
import Navigation from './Navigation';

const Header = ({ onNavigate }) => {
  return (
    <header>
      <h1>Mi web</h1>
      <h2>Subtítulo de mi web</h2>
      <Navigation onNavigate={onNavigate} />
    </header>
  );
};

export default Header;
