// in: frontend/src/App.js

import React from 'react';
import Register from './pages/Register'; // Import our new page
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Your Fitness Planner</h1>
        <Register /> {/* Display the Register component */}
      </header>
    </div>
  );
}

export default App;