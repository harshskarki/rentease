import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ItemDetail from './pages/ItemDetail';
import CreateItem from './pages/CreateItem';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import Wishlist from './pages/Wishlist';
import Navbar from './components/Navbar';
import './index.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.body.style.background = darkMode ? '#111827' : '#f9fafb';
    document.body.style.color = darkMode ? '#f9fafb' : '#111827';
  }, [darkMode]);

  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <div style={{ minHeight: '100vh', background: darkMode ? '#111827' : '#f9fafb', color: darkMode ? '#f9fafb' : '#111827' }}>
          <Routes>
            <Route path="/" element={<Home darkMode={darkMode} />} />
            <Route path="/login" element={<Login darkMode={darkMode} />} />
            <Route path="/register" element={<Register darkMode={darkMode} />} />
            <Route path="/items/:id" element={<ItemDetail darkMode={darkMode} />} />
            <Route path="/create-item" element={<CreateItem darkMode={darkMode} />} />
            <Route path="/dashboard" element={<Dashboard darkMode={darkMode} />} />
            <Route path="/profile" element={<Profile darkMode={darkMode} />} />
            <Route path="/users/:id" element={<PublicProfile darkMode={darkMode} />} />
            <Route path="/wishlist" element={<Wishlist darkMode={darkMode} />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
