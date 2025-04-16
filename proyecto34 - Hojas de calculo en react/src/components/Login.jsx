import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('jocarsa');
  const [password, setPassword] = useState('jocarsa');
  const [error, setError] = useState('');

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
        // Already logged in
        navigate('/dashboard');
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleLogin() {
    setError('');
    try {
      const res = await fetch('http://localhost/react19/proyecto34/back/back.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch (e) {
      console.error(e);
      setError('Login failed due to a network error.');
    }
  }

  return (
    <div className="login-container">
      <h1>Login</h1>
      <div className="form-group">
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="jocarsa"
        />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="jocarsa"
        />
      </div>
      <button onClick={handleLogin}>Login</button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default Login;
