import React, { useState } from 'react';
import './GreenButton.css';

const GreenButton = () => {
  const [count, setCount] = useState(0);

  return (
    <button className="miboton verde" onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
};

export default GreenButton;
