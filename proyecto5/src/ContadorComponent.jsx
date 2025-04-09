import React, { useState } from 'react';
import './ContadorComponent.css';

// Componente1: Contains a button that, when clicked, triggers a callback
const Componente1 = ({ onButtonClick }) => {
  return (
    <div>
      <button onClick={onButtonClick}>Pulsame</button>
    </div>
  );
};

// Componente2: Displays text with its background color controlled by props
const Componente2 = ({ bgColor }) => {
  return (
    <div style={{ background: bgColor }}>
      Hola que tal
    </div>
  );
};

// ContadorComponent: Parent component that houses the state and manages communication
const ContadorComponent = () => {
  // We start with a default background color (for example: transparent)
  const [bgColor, setBgColor] = useState("transparent");

  // This function updates the background color when the button is clicked
  const changeBackgroundColor = () => {
    setBgColor("red");
  };

  return (
    <div>
      <Componente1 onButtonClick={changeBackgroundColor} />
      <Componente2 bgColor={bgColor} />
    </div>
  );
};

export default ContadorComponent;
