import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [newDocName, setNewDocName] = useState('');

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const res = await fetch('http://localhost/react19/proyecto34/back/back.php?action=getSessionUser', {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.loggedIn) {
        setCurrentUser(data.user);
        loadDocumentList();
      } else {
        // If not logged in, go back to login
        navigate('/');
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function loadDocumentList() {
    try {
      const res = await fetch('http://localhost/react19/proyecto34/back/back.php?action=getDocs', {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setDocuments(data.documents);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleLogout() {
    try {
      const res = await fetch('http://localhost/react19/proyecto34/back/back.php?action=logout', {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function createDocument() {
    if (!newDocName.trim()) return;
    try {
      const res = await fetch('http://localhost/react19/proyecto34/back/back.php?action=createDoc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ docName: newDocName.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setNewDocName('');
        loadDocumentList();
      } else {
        alert(data.message || 'Error creating document');
      }
    } catch (err) {
      console.error(err);
    }
  }

  function openDocument(docId) {
    navigate(`/editor/${docId}`);
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {currentUser && (
        <div className="user-info">
          Welcome, {currentUser.full_name} ({currentUser.email})
        </div>
      )}

      <h2>Your Documents</h2>
      <ul className="document-list">
        {documents.map(doc => (
          <li key={doc.id}>
            {doc.doc_name}{' '}
            <button onClick={() => openDocument(doc.id)}>Open</button>
          </li>
        ))}
      </ul>

      <div className="new-doc-container">
        <h3>Create a New Document</h3>
        <input
          type="text"
          value={newDocName}
          onChange={e => setNewDocName(e.target.value)}
          placeholder="Enter a document name"
        />
        <button onClick={createDocument}>Create</button>
      </div>
    </div>
  );
}

export default Dashboard;
