import React from 'react';
import './PageContent.css';

const PageContent = ({ page, onBack }) => {
  return (
    <div className="page-content">
      <button className="back-btn" onClick={onBack}>Back to Blog</button>
      <h2>{page.title}</h2>
      {page.imagen && <img src={page.imagen} alt={page.title} className="page-image" />}
      <div className="page-body" dangerouslySetInnerHTML={{ __html: page.content }} />
    </div>
  );
};

export default PageContent;
