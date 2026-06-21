import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = ({ darkMode, setDarkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setMenuOpen(false);
  };

  const navBg = darkMode ? '#1f2937' : '#fff';
  const linkColor = darkMode ? '#d1d5db' : '#374151';
  const text = darkMode ? '#f9fafb' : '#111827';

  const linkStyle = { textDecoration: 'none', color: linkColor, fontWeight: '500', padding: '0.5rem 0', display: 'block' };

  return (
    <nav style={{ background: navBg, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
        
        {/* Logo */}
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: '#2563eb' }}>
          RentEase
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          <Link to="/" style={{ textDecoration: 'none', color: linkColor, fontWeight: '500' }}>Browse</Link>
          {user ? (
            <>
              <Link to="/create-item" style={{ textDecoration: 'none', color: linkColor, fontWeight: '500' }}>List Item</Link>
              <Link to="/wishlist" style={{ textDecoration: 'none', color: linkColor, fontWeight: '500' }}>Wishlist</Link>
              <Link to="/dashboard" style={{ textDecoration: 'none', color: linkColor, fontWeight: '500' }}>Dashboard</Link>
              <Link to="/profile" style={{ textDecoration: 'none', color: linkColor, fontWeight: '500' }}>Profile</Link>
              {user.role === 'admin' && <Link to="/admin" style={{ textDecoration: 'none', color: '#dc2626', fontWeight: '600' }}>Admin</Link>}
              <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: linkColor, fontWeight: '500' }}>Login</Link>
              <Link to="/register" style={{ textDecoration: 'none', background: '#2563eb', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: '500' }}>Register</Link>
            </>
          )}
          <button onClick={() => setDarkMode(!darkMode)}
            style={{ background: darkMode ? '#374151' : '#f3f4f6', border: 'none', padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer', color: text, fontWeight: '500' }}>
            {darkMode ? 'Light' : 'Dark'}
          </button>
        </div>

        {/* Mobile hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="mobile-nav">
          <button onClick={() => setDarkMode(!darkMode)}
            style={{ background: darkMode ? '#374151' : '#f3f4f6', border: 'none', padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer', color: text, fontWeight: '500' }}>
            {darkMode ? 'Light' : 'Dark'}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', color: text, fontSize: '1.5rem' }}>
            {menuOpen ? 'X' : '='}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ background: navBg, padding: '1rem 1.5rem', borderTop: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}` }} className="mobile-menu">
          <Link to="/" style={linkStyle} onClick={() => setMenuOpen(false)}>Browse</Link>
          {user ? (
            <>
              <Link to="/create-item" style={linkStyle} onClick={() => setMenuOpen(false)}>List Item</Link>
              <Link to="/wishlist" style={linkStyle} onClick={() => setMenuOpen(false)}>Wishlist</Link>
              <Link to="/dashboard" style={linkStyle} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/profile" style={linkStyle} onClick={() => setMenuOpen(false)}>Profile</Link>
              {user.role === 'admin' && <Link to="/admin" style={{ ...linkStyle, color: '#dc2626', fontWeight: '600' }} onClick={() => setMenuOpen(false)}>Admin</Link>}
              <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', marginTop: '0.5rem', width: '100%' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" style={{ ...linkStyle, background: '#2563eb', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', textAlign: 'center', marginTop: '0.5rem' }} onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}

      {/* Responsive CSS */}
      <style>{`
        .desktop-nav { display: flex !important; }
        .mobile-nav { display: none !important; }
        .mobile-menu { display: block; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
