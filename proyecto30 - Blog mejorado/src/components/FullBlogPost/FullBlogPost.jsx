import React from 'react';
import './FullBlogPost.css';
import CommentsForm from '../CommentsForm/CommentsForm';

const FullBlogPost = ({ post, onBackToPosts, comments = [], addComment }) => {
  return (
    <div className="post-detail active">
      <button className="back-btn" onClick={onBackToPosts}>Back to Posts</button>
      <h2>{post.title}</h2>
      <p className="post-date">{post.date}</p>
      {post.imagen && <img src={post.imagen} alt={post.title} className="full-post-image" />}
      <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      
      <div className="comment-section">
        <h3>Comments</h3>
        <div className="comments-list">
          {comments.length > 0 ? comments.map((comment, index) => (
            <div key={index} className="comment">
              <strong>{comment.name}</strong>: {comment.comment} <em>({comment.date})</em>
            </div>
          )) : <p>No comments yet.</p>}
        </div>
        <CommentsForm onAddComment={addComment} />
      </div>
    </div>
  );
};

export default FullBlogPost;
