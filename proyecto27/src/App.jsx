import React, { useState, useCallback } from 'react';
import './App.css';

function App() {
  const [base64String, setBase64String] = useState('');

  // Function to process the image file.
  const handleFile = useCallback(file => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64String(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle file input change.
  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  // For drag and drop.
  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  // Build the sample img tag using the Base64 string.
  const imgTagSnippet = base64String 
    ? `<img src="${base64String}" alt="Uploaded Image" />`
    : '';

  // Copy text to clipboard helper.
  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => {
          alert("Copied to clipboard!");
        })
        .catch((err) => {
          console.error("Could not copy text: ", err);
        });
    } else {
      // Fallback for older browsers.
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.top = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          alert("Copied to clipboard!");
        } else {
          alert("Failed to copy!");
        }
      } catch (err) {
        console.error("Fallback: Could not copy text", err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="App">
      <h1>jocarsa | base64</h1>
      <h2>Convertidor de imagenes en base64</h2>

      {/* File input */}
      <input 
        type="file" 
        accept="image/*" 
        onChange={onFileChange}
        style={{ marginBottom: '20px' }}
      />
      
      {/* Drag and drop container */}
      <div 
        className="drag-container"
        onDragOver={onDragOver} 
        onDrop={onDrop} 
      >
        Suelta una imagen aqui
      </div>

      {/* Display the outputs only if a Base64 string exists */}
      {base64String && (
        <>
          <div>
            <strong>Cadena en base64:</strong>
            <textarea 
              value={base64String}
              readOnly 
              style={{ width: '95%', height: '150px', marginTop: '10px' }}
            />
            <br />
            <button 
              className="copy-button"
              onClick={() => copyToClipboard(base64String)}
            >
              Copiar
            </button>
          </div>
          <div style={{ marginTop: '20px' }}>
            <strong>Muestra con etiqueta html img:</strong>
            <textarea 
              value={imgTagSnippet}
              readOnly 
              style={{ width: '95%', height: '50px', marginTop: '10px' }}
            />
            <br />
            <button 
              className="copy-button"
              onClick={() => copyToClipboard(imgTagSnippet)}
            >
              Copiar
            </button>
          </div>
          <div style={{ marginTop: '20px' }}>
            <strong>Previsualización:</strong>
            <br />
            <img 
              src={base64String} 
              alt="Preview" 
              className="preview-image"
              style={{ maxWidth: '95%', marginTop: '10px' }} 
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
