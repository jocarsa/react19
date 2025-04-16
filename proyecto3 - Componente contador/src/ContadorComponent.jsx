import React, { useState } from 'react';
import './ContadorComponent.css'

const ContadorComponent = () => {
  const [cuenta, setCount] = useState(0);

  return (
    <div>
        <button onClick={() => setCount(cuenta + 1)}>Incrementar</button>
      <p>Contador: {cuenta}</p>
      
    </div>
  );
};

export default ContadorComponent;