import React, { useState } from 'react';
import './RedButton.css';

const RedButton = () => {
  const [count, setCount] = useState(0);

  return (
    <button className="miboton rojo" onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
};

export default RedButton;
