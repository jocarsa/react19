// src/components/Main.jsx
import React from 'react';
import Inicio from './Inicio';
import QuienSoy from './QuienSoy';
import Proyectos from './Proyectos';

const Main = ({ activeSection }) => {
  // Choose the section component to render based on activeSection
  const renderSection = () => {
    switch(activeSection) {
      case 'inicio':
        return <Inicio />;
      case 'quiensoy':
        return <QuienSoy />;
      case 'proyectos':
        return <Proyectos />;
      default:
        return <Inicio />;
    }
  };

  return (
    <main>
      {renderSection()}
    </main>
  );
};

export default Main;
