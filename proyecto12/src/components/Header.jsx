// src/components/Header.jsx
import React, { useState } from 'react';
import './Header.css'; // optional separate CSS file for the header

const Header = () => {
  const [fontSize, setFontSize] = useState(1);
  const [inverted, setInverted] = useState(false);

  const handleLogout = () => {
    // replicate the original "go to login page" logic
    window.location.href = '../login/004-estilo del formulario.html';
  };

  const increaseFont = () => {
    setFontSize((prev) => prev * 1.1);
    document.body.style.fontSize = `${fontSize * 1.1}em`;
  };

  const decreaseFont = () => {
    setFontSize((prev) => prev * 0.9);
    document.body.style.fontSize = `${fontSize * 0.9}em`;
  };

  const toggleInvert = () => {
    setInverted((prev) => !prev);
    if (!inverted) {
      // invert on
      document.documentElement.style.filter = 'invert(1) hue-rotate(150deg)';
    } else {
      // revert
      document.documentElement.style.filter = 'invert(0) hue-rotate(0deg)';
    }
  };

  return (
    <header>
      <h1>
        <img 
          src="https://static.jocarsa.com/logos/teal.png"
          alt="logo"
          style={{ width: '35px', marginRight: '16px' }}
        />
        jocarsa | aplicación
      </h1>
      <nav>
        {/* Just some dummy buttons for demonstration */}
        <button className="boton relieve">A</button>
        <button className="boton relieve">A</button>
        {/* ...other placeholder buttons if you want them... */}
        <button className="boton relieve" onClick={toggleInvert}>
          <span className="icono">☀</span>
        </button>
        <button className="boton relieve" onClick={increaseFont}>
          <span className="icono">🔎+</span>
        </button>
        <button className="boton relieve" onClick={decreaseFont}>
          <span className="icono">🔎-</span>
        </button>
      </nav>
      <div id="cerrarsesion" onClick={handleLogout}>
        🔒
      </div>
    </header>
  );
};

export default Header;
