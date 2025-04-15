import React from 'react';
import './BlogPostCard.css';

const BlogPostCard = ({ post, onClick }) => {
  return (
    <div className="post-card" onClick={onClick}>
      {post.imagen && <img src={post.imagen} alt={post.title} className="post-card-image" />}
      <h2>{post.title}</h2>
      <p>{post.excerpt}</p>
      <p className="post-date">{post.date}</p>
    </div>
  );
};

export default BlogPostCard;
