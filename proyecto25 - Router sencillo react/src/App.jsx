import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Two simple components for the routes
function Home() {
  return <h2>Home Page</h2>;
}

function About() {
  return <h2>About Page</h2>;
}

// The main App component that sets up routing
function App() {
  return (
    <Router>
      <div>
        {/* Navigation links */}
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>

        {/* Route definitions */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
