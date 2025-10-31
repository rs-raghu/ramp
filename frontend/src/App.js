// in: frontend/src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

// Import our auth functions
import { logout, getCurrentUser } from './services/authService';
import './App.css';

// --- Navigation component is now smarter ---
function Navigation({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Call the logout function from App.js
    navigate('/login'); // Redirect to login
  };

  return (
    <nav style={{ background: '#333', padding: '1rem', textAlign: 'center' }}>
      
      {/* --- This is the new logic --- */}
      {isLoggedIn ? (
        // If logged in, show Dashboard and Logout
        <>
          <Link to="/" style={navLinkStyle}>Dashboard</Link>
          <button onClick={handleLogout} style={navLinkStyle}>Logout</button>
        </>
      ) : (
        // If not logged in, show Login and Register
        <>
          <Link to="/login" style={navLinkStyle}>Login</Link>
          <Link to="/register" style={navLinkStyle}>Register</Link>
        </>
      )}
    </nav>
  );
}

const navLinkStyle = {
  color: 'white',
  margin: '0 1rem',
  textDecoration: 'none',
  fontWeight: 'bold',
  background: 'none', // Make button look like a link
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: 'inherit'
};

function App() {
  // --- Main state for authentication ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is already logged in when app first loads
  useEffect(() => {
    if (getCurrentUser()) {
      setIsLoggedIn(true);
    }
  }, []); // Empty array means this runs once on load

  // Function to run when login is successful
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // Function to run when user logs out
  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <div className="App">
        {/* Pass the state and logout function to Navigation */}
        <Navigation isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          {/* Pass the login success handler to the Login page */}
          <Route 
            path="/login" 
            element={<Login onLoginSuccess={handleLoginSuccess} />} 
          />
          
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;