import React from 'react';

const Componente1 = ({ onButtonClick }) => {
  return (
    <div id="componente1">
      <button onClick={onButtonClick}>Pulsame</button>
    </div>
  );
};

export default Componente1;
