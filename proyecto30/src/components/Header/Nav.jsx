import React from 'react';
import './Nav.css';

const Nav = ({ categories, currentCategory, onCategoryChange }) => {
  return (
    <nav className="navbar">
      <ul className="categories">
        <li 
          className={currentCategory === 'all' ? 'active' : ''} 
          onClick={() => onCategoryChange('all')}
        >
          All
        </li>
        {categories.map(category => (
          <li 
            key={category}
            className={currentCategory === category ? 'active' : ''}
            onClick={() => onCategoryChange(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
