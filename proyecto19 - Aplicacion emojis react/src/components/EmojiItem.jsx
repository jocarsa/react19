// src/components/EmojiItem.jsx
import React from 'react';
import './EmojiItem.css';

const EmojiItem = ({ emojiObj, copyEmoji }) => {
  return (
    <div 
      className="emoji-item" 
      title={emojiObj.es} 
      onClick={() => copyEmoji(emojiObj.emoji)}
    >
      {emojiObj.emoji}
    </div>
  );
};

export default EmojiItem;
