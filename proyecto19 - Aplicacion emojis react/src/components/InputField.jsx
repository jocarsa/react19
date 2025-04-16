// src/components/InputField.jsx
import React from 'react';
import './InputField.css';

const InputField = ({ value, onChange }) => {
  return (
    <div className="input-container">
      <input 
        type="text"
        placeholder="Buscar un emoji..."
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputField;
