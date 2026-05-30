import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = ({ darkMode, setDarkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const nav = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1rem 2rem', background: darkMode ? '#1f2937' : '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100,
  };

  const linkStyle = { textDecoration: 'none', color: darkMode ? '#d1d5db' : '#374151', fontWeight: '500' };

  return (
    <nav style={nav}>
      <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: '#2563eb' }}>
        RentEase
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/" style={linkStyle}>Browse</Link>
        {user ? (
          <>
            <Link to="/create-item" style={linkStyle}>List Item</Link>
            <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
            <Link to="/profile" style={linkStyle}>Profile</Link>
            <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={{ textDecoration: 'none', background: '#2563eb', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: '500' }}>Register</Link>
          </>
        )}
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{ background: darkMode ? '#374151' : '#f3f4f6', border: 'none', padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer', color: darkMode ? '#f9fafb' : '#111827', fontWeight: '500' }}
        >
          {darkMode ? 'Light' : 'Dark'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
