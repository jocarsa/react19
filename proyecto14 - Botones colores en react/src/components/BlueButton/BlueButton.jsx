import React, { useState } from 'react';
import './BlueButton.css';

const BlueButton = () => {
  const [count, setCount] = useState(0);

  return (
    <button className="miboton azul" onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
};

export default BlueButton;
