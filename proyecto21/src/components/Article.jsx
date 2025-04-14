import React from 'react';
import './Article.css';

function Article({ color, onCopy }) {
  const { colorName, hex, rgb, cmyk } = color;

  return (
    <article className="color-article" style={{ backgroundColor: hex }}>
      <p>
          <button onClick={() => onCopy(colorName)}>📋</button> 
        Nombre: {colorName}
        
      </p>
      <p>
          <button onClick={() => onCopy(hex)}>📋</button> 
        Hexadecimal: {hex}
        
      </p>
      <p>
          <button onClick={() => onCopy(rgb)}>📋</button> 
        RGB: {rgb}
        
      </p>
      <p>
          <button onClick={() => onCopy(cmyk)}>📋</button> 
        CMYK: {cmyk}
        
      </p>
    </article>
  );
}

export default Article;
