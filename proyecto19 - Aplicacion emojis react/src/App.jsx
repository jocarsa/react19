// src/App.jsx
import React, { useState, useEffect } from 'react';
import InputField from './components/InputField';
import EmojiItem from './components/EmojiItem';
import './App.css';

const App = () => {
  const [emojis, setEmojis] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load emoji data from the remote JSON on component mount.
  useEffect(() => {
    fetch('https://jocarsa.github.io/static/emojis.json')
      .then(response => response.json())
      .then(data => setEmojis(data))
      .catch(error => console.error('Error loading emojis:', error));
  }, []);

  // Update the search term on each keystroke.
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter emojis based on the search term across any language string (excluding the "emoji" key).
  const filteredEmojis = emojis.filter(emojiObj => {
    const searchTermLower = searchTerm.toLowerCase();
    // Check every key except the emoji character itself.
    return Object.keys(emojiObj).some(key => {
      if (key !== 'emoji') {
        return emojiObj[key].toLowerCase().includes(searchTermLower);
      }
      return false;
    });
  });

  // Copy the emoji character to the clipboard.
  const copyEmoji = (emoji) => {
    navigator.clipboard.writeText(emoji).then(() => {
      alert('¡Emoji copiado al portapapeles!');
    });
  };

  return (
    <div className="App">
      <h1>Buscador de Emojis</h1>
      <InputField value={searchTerm} onChange={handleSearch} />
      <div className="emoji-grid">
        {filteredEmojis.map((emojiObj, index) => (
          <EmojiItem key={index} emojiObj={emojiObj} copyEmoji={copyEmoji} />
        ))}
      </div>
    </div>
  );
};

export default App;
