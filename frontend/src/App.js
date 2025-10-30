// in: frontend/src/App.js

import React from 'react';
import Register from './pages/Register';
import Login from './pages/Login'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Your Fitness Planner</h1>
        <Register /> {/* Display the Register component */}
        <Login />    {/* Display the Login component */}
      </header>
    </div>
  );
}

export default App;