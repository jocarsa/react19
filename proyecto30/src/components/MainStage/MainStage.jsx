import React from 'react';
import './MainStage.css';
import BlogPostCard from '../BlogPostCard/BlogPostCard';
import FullBlogPost from '../FullBlogPost/FullBlogPost';

const MainStage = ({
    posts,
    selectedPost,
    currentPage,
    postsPerPage,
    totalPosts,
    onPostClick,
    onPageChange,
    onBackToPosts,
    comments,
    addComment
}) => {
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    if (selectedPost) {
        // Render the full detailed blog post view
        return (
            <section className="main-stage">
                <FullBlogPost 
                  post={selectedPost} 
                  onBackToPosts={onBackToPosts} 
                  comments={comments} 
                  addComment={addComment} 
                />
            </section>
        );
    }

    return (
        <section className="main-stage">
            <div className="posts-list">
                {posts.map(post => (
                    <BlogPostCard key={post.id} post={post} onClick={() => onPostClick(post)} />
                ))}
            </div>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        className={currentPage === i + 1 ? 'active' : ''}
                        onClick={() => onPageChange(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default MainStage;
