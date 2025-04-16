import React from 'react';
import './MainStage.css';
import BlogPostCard from '../BlogPostCard/BlogPostCard';
import FullBlogPost from '../FullBlogPost/FullBlogPost';
import PageContent from '../PageContent/PageContent';

const MainStage = ({
    posts,
    selectedPost,
    selectedPage,
    currentPage,
    postsPerPage,
    totalPosts,
    onPostClick,
    onPageChange,
    onBackToContent,
    comments,
    addComment
}) => {
    // Render a static page if one is selected
    if (selectedPage) {
      return (
        <section className="main-stage">
          <PageContent page={selectedPage} onBack={onBackToContent} />
        </section>
      );
    }
    // Render a full blog post if one is selected
    if (selectedPost) {
      return (
        <section className="main-stage">
          <FullBlogPost 
            post={selectedPost} 
            onBackToPosts={onBackToContent} 
            comments={comments} 
            addComment={addComment} 
          />
        </section>
      );
    }
    // Otherwise, render the paginated blog post list
    return (
        <section className="main-stage">
            <div className="posts-list">
                {posts.map(post => (
                    <BlogPostCard key={post.id} post={post} onClick={() => onPostClick(post)} />
                ))}
            </div>
            <div className="pagination">
                {Array.from({ length: Math.ceil(totalPosts / postsPerPage) }, (_, i) => (
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
