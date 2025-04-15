import React from 'react';
import './Header.css';
import Nav from './Nav';

const Header = ({ blogTitle, blogSubtitle, categories, currentCategory, onCategoryChange }) => {
  return (
    <header>
      <div className="header-content">
        <h1 className="blog-title">{blogTitle}</h1>
        <p className="blog-subtitle">{blogSubtitle}</p>
      </div>
      <Nav 
        categories={categories} 
        currentCategory={currentCategory} 
        onCategoryChange={onCategoryChange} 
      />
    </header>
  );
};

export default Header;
