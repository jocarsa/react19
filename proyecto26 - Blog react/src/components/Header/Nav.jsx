import React from 'react';
import './Nav.css';

const Nav = ({ 
  categories, 
  currentCategory, 
  onCategoryChange,
  pages,
  selectedPage,
  onPageSelect
}) => {
  return (
    <nav className="navbar">
      <ul className="categories">
        <li 
          className={currentCategory === 'all' && !selectedPage ? 'active' : ''} 
          onClick={() => onCategoryChange('all')}
        >
          Blog
        </li>
        {categories.map(category => (
          <li 
            key={category}
            className={currentCategory === category && !selectedPage ? 'active' : ''}
            onClick={() => onCategoryChange(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </li>
        ))}
      </ul>
      <ul className="pages">
        {pages.map(page => (
          <li 
            key={page.id} 
            className={selectedPage && selectedPage.id === page.id ? 'active' : ''}
            onClick={() => onPageSelect(page)}
          >
            {page.title}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
