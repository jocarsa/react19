import React, { useState, useEffect } from 'react';
import Article from './components/Article';
import './App.css';

function App() {
  const [colors, setColors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch the JSON data when the component mounts.
  useEffect(() => {
    fetch('https://jocarsa.github.io/static/csscolors.json')
      .then((response) => response.json())
      .then((data) => setColors(data))
      .catch((error) => console.error('Error fetching colors:', error));
  }, []);

  // Filter the colors based on the search input.
  const filteredColors = colors.filter((color) =>
    color.colorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Copy function using the Clipboard API.
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert(`Copied: ${text}`))
      .catch((err) => console.error('Failed to copy!', err));
  };

  return (
    <div className="app-container">
      <h1>jocarsa | colores</h1>
      <input
        type="text"
        id="buscar"
        placeholder="Search for a color..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <main>
        {filteredColors.map((color, idx) => (
          <Article key={idx} color={color} onCopy={handleCopy} />
        ))}
      </main>
    </div>
  );
}

export default App;
