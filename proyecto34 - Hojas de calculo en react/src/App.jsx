import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor/:docId" element={<Editor />} />
      </Routes>
    </Router>
  );
}

export default App;
