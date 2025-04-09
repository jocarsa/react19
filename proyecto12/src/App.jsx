// src/App.jsx
import React from 'react';
import Header from './components/Header';
import NavMenu from './components/NavMenu';
import TableSection from './components/TableSection';
import Footer from './components/Footer';

import './App.css'; // you can place all your global style here

function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <main>
        <NavMenu />
        <TableSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
