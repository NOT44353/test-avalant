import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Challenge1 from './pages/Challenge1';
import Challenge2 from './pages/Challenge2';
import Challenge3 from './pages/Challenge3';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/challenge1" element={<Challenge1 />} />
          <Route path="/challenge2" element={<Challenge2 />} />
          <Route path="/challenge3" element={<Challenge3 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
