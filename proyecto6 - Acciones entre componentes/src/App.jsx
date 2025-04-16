import React, { useState } from 'react';
import Componente1 from './Componente1';
import Componente2 from './Componente2';
import './ContadorComponent.css'; // Make sure to import your CSS

const App = () => {
  // Hold the background color state here
  const [bgColor, setBgColor] = useState('transparent');

  // This function will be called when the button in Componente1 is clicked
  const changeBackgroundColor = () => {
    setBgColor('red');
  };

  return (
    <div>
      <Componente1 onButtonClick={changeBackgroundColor} />
      <Componente2 bgColor={bgColor} />
    </div>
  );
};

export default App;
