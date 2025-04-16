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
  const [pages, setPages] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [commentsStore, setCommentsStore] = useState({});
  const [currentCategory, setCurrentCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);

  useEffect(() => {
    // Define CSV URLs:
    const blogDataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_I9jPEz7cZlFf8HFGUDtUotF5IiDYm4m_dhZLzL3hTm9SmGMSDAldWEMrcPjdJp1JUcQW7HNQwy03/pub?output=csv";
    const categoriesUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRoZIHWfEmm0KRUPixFm1pOd6lljj_Fzh2KZeKgnxJI0EySJ77e4Wprp3FsrToxqPLTpWFxed9uPfYB/pub?output=csv";
    const postsUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vScrdHXyCSMWGJN-pnokDxBvrqOVl8jiVsG7qQUdYRp_WyUsbh-nBhgbLkEs8dIwkXBX6J-_C1twAym/pub?output=csv";
    const pagesUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQq8W35GpzeWmrmEkbtZGdFE8PC_Xw-ZggwIo6UHi5GBKFWZSwrmNrEdO_Wbtz_fUAsrn4J-r1-Exgv/pub?output=csv";

    Promise.all([
      fetch(blogDataUrl).then(res => res.text()),
      fetch(categoriesUrl).then(res => res.text()),
      fetch(postsUrl).then(res => res.text()),
      fetch(pagesUrl).then(res => res.text())
    ])
      .then(([blogText, categoriesText, postsText, pagesText]) => {
        // --- Parse Blog Data CSV ---
        // Format: key,value (e.g., "title,My Awesome Blog")
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
        // One category per line
        const categoriesArray = categoriesText
          .split('\n')
          .map(category => category.trim())
          .filter(Boolean);

        // --- Parse Posts CSV ---
        // CSV now includes an extra column "imagen" (post image URL)
        const postsResult = Papa.parse(postsText, { header: true, skipEmptyLines: true });
        const postsData = postsResult.data;

        // --- Parse Pages CSV ---
        // Expect columns: id,title,imagen,content
        const pagesResult = Papa.parse(pagesText, { header: true, skipEmptyLines: true });
        const pagesData = pagesResult.data;

        setBlogData(blogObj);
        setCategories(categoriesArray);
        setPosts(postsData);
        setFilteredPosts(postsData);
        setPages(pagesData);
        setCommentsStore({});
      })
      .catch(error => console.error("Error loading CSV data:", error));
  }, []);

  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
    setCurrentPage(1);
    setSelectedPost(null);
    setSelectedPage(null);
    if (category === 'all') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.category === category));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedPost(null);
    setSelectedPage(null);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setSelectedPage(null);
  };

  const handlePageSelect = (page) => {
    setSelectedPage(page);
    setSelectedPost(null);
  };

  const handleBackToContent = () => {
    // Clear selected post/page to return to blog overview
    setSelectedPost(null);
    setSelectedPage(null);
  };

  const handleAddComment = (newComment) => {
    if (!selectedPost) return;
    const postId = selectedPost.id;
    setCommentsStore(prev => {
      const postComments = prev[postId] ? [...prev[postId], newComment] : [newComment];
      return { ...prev, [postId]: postComments };
    });
  };

  // Determine posts to display on current page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Show a loading animation until the blog data is loaded.
  if (!blogData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header 
        blogTitle={blogData.title} 
        blogSubtitle={blogData.subtitle} 
        categories={categories} 
        currentCategory={currentCategory}
        pages={pages}
        selectedPage={selectedPage}
        onCategoryChange={handleCategoryChange}
        onPageSelect={handlePageSelect}
      />
      <MainStage 
        posts={currentPosts} 
        selectedPost={selectedPost} 
        selectedPage={selectedPage}
        currentPage={currentPage}
        postsPerPage={postsPerPage}
        totalPosts={filteredPosts.length}
        onPostClick={handlePostClick}
        onPageChange={handlePageChange}
        onBackToContent={handleBackToContent}
        comments={selectedPost ? (commentsStore[selectedPost.id] || []) : []}
        addComment={handleAddComment}
      />
      <Footer footerText={blogData.footer} />
    </div>
  );
}

export default App;
