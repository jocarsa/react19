// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';

function App() {
  const [activeSection, setActiveSection] = useState('inicio');

  // Set the initial section based on the URL hash (if present)
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      setActiveSection(hash);
    }
  }, []);

  // This function will be passed to Navigation so that clicking a button changes the active section.
  const handleNavigation = (section) => {
    setActiveSection(section);
    window.location.hash = section;
  };

  return (
    <div className="App">
      <Header onNavigate={handleNavigation} />
      <Main activeSection={activeSection} />
      <Footer />
    </div>
  );
}

export default App;
