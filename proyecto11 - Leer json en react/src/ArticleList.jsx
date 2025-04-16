import React, { useEffect, useState } from 'react';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/data') // Replace with your actual endpoint
      .then((response) => response.json())
      .then((data) => setArticles(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <main style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
      {articles.map((articulo, index) => (
        <article key={index} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #ddd' }}>
          <h3 style={{ color: '#333' }}>{articulo.titulo}</h3>
          <p style={{ color: '#666' }}>{articulo.texto}</p>
        </article>
      ))}
    </main>
  );
};

export default ArticleList;
