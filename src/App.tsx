// ========================================================================
// Diabetic Retinopathy Detection - Frontend
// ========================================================================
// Finish frontend first — demo on 18 Nov 2025
// After demo: improve algorithms and dataset processing
// Keep UI code modular for later extension
// ========================================================================
// Install dependencies:
// npm install axios react-router-dom
// ========================================================================

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './views/Home';
import Explain from './views/Explain';
import History from './views/History';
import './App.css';

function App() {
  const [lastUploadedImage, setLastUploadedImage] = useState<string | File | null>(null);

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="navbar-content">
            <Link to="/" className="navbar-logo">
              <span className="logo-icon">👁️</span>
              <span className="logo-text">DR Detector</span>
            </Link>
            <ul className="navbar-links">
              <li>
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li>
                <Link to="/explain" className="nav-link">Explainability</Link>
              </li>
              <li>
                <Link to="/history" className="nav-link">History</Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <Home setLastUploadedImage={setLastUploadedImage} />
              }
            />
            <Route
              path="/explain"
              element={
                <Explain lastUploadedImage={lastUploadedImage} />
              }
            />
            <Route
              path="/history"
              element={<History />}
            />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; 2025 Diabetic Retinopathy Detection System. For demonstration purposes.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
