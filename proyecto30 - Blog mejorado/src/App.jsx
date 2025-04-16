import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Header from './components/Header/Header';
import MainStage from './components/MainStage/MainStage';
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
  const [blogData, setBlogData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [commentsStore, setCommentsStore] = useState({});
  const [currentCategory, setCurrentCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const postsPerPage = 6;

  useEffect(() => {
    // CSV URLs:
    const blogDataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_I9jPEz7cZlFf8HFGUDtUotF5IiDYm4m_dhZLzL3hTm9SmGMSDAldWEMrcPjdJp1JUcQW7HNQwy03/pub?output=csv";
    const categoriesUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRoZIHWfEmm0KRUPixFm1pOd6lljj_Fzh2KZeKgnxJI0EySJ77e4Wprp3FsrToxqPLTpWFxed9uPfYB/pub?output=csv";
    const postsUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vScrdHXyCSMWGJN-pnokDxBvrqOVl8jiVsG7qQUdYRp_WyUsbh-nBhgbLkEs8dIwkXBX6J-_C1twAym/pub?output=csv";

    Promise.all([
      fetch(blogDataUrl).then(res => res.text()),
      fetch(categoriesUrl).then(res => res.text()),
      fetch(postsUrl).then(res => res.text())
    ])
      .then(([blogText, categoriesText, postsText]) => {
        // --- Parse Blog Data CSV ---
        // Format: key,value on each line (e.g., title,My Awesome Blog)
        const blogLines = blogText.split('\n').filter(line => line.trim() !== '');
        const blogObj = {};
        blogLines.forEach(line => {
          const commaIndex = line.indexOf(',');
          if (commaIndex !== -1) {
            const key = line.slice(0, commaIndex).trim();
            const value = line.slice(commaIndex + 1).trim();
            blogObj[key] = value;
          }
        });

        // --- Parse Categories CSV ---
        // Each line is a category string (e.g., tech, lifestyle, news)
        const categoriesArray = categoriesText
          .split('\n')
          .map(category => category.trim())
          .filter(Boolean);

        // --- Parse Posts CSV ---
        // Note: The CSV now includes an additional column "imagen" for the post image URL.
        const postsResult = Papa.parse(postsText, { header: true, skipEmptyLines: true });
        const postsData = postsResult.data;

        // Set state with the parsed data
        setBlogData(blogObj);
        setCategories(categoriesArray);
        setPosts(postsData);
        setFilteredPosts(postsData);
        setCommentsStore({});
      })
      .catch(error => console.error("Error loading CSV data:", error));
  }, []);

  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
    setCurrentPage(1);
    if (category === 'all') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.category === category));
    }
    setSelectedPost(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handleBackToPosts = () => {
    setSelectedPost(null);
  };

  const handleAddComment = (newComment) => {
    if (!selectedPost) return;
    const postId = selectedPost.id;
    setCommentsStore(prev => {
      const postComments = prev[postId] ? [...prev[postId], newComment] : [newComment];
      return { ...prev, [postId]: postComments };
    });
  };

  // Determine posts to display based on current pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="App">
      {blogData && (
        <Header
          blogTitle={blogData.title}
          blogSubtitle={blogData.subtitle}
          categories={categories}
          currentCategory={currentCategory}
          onCategoryChange={handleCategoryChange}
        />
      )}
      <MainStage 
        posts={currentPosts} 
        selectedPost={selectedPost} 
        currentPage={currentPage}
        postsPerPage={postsPerPage}
        totalPosts={filteredPosts.length}
        onPostClick={handlePostClick}
        onPageChange={handlePageChange}
        onBackToPosts={handleBackToPosts}
        comments={selectedPost ? (commentsStore[selectedPost.id] || []) : []}
        addComment={handleAddComment}
      />
      {blogData && (
        <Footer footerText={blogData.footer} />
      )}
    </div>
  );
}

export default App;
