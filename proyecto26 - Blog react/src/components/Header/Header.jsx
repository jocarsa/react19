import React from 'react';
import './Header.css';
import Nav from './Nav';

const Header = ({ blogTitle, blogSubtitle, categories, currentCategory, pages, selectedPage, onCategoryChange, onPageSelect }) => {
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
        pages={pages}
        selectedPage={selectedPage}
        onPageSelect={onPageSelect}
      />
    </header>
  );
};

export default Header;
