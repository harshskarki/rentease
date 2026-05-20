import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>RentEase</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Browse</Link>
        {user ? (
          <>
            <Link to="/create-item" style={styles.link}>List Item</Link>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <span style={styles.username}>Hi, {user.name}</span>
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.btnLink}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 },
  logo: { fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: '#2563eb' },
  links: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
  link: { textDecoration: 'none', color: '#374151', fontWeight: '500' },
  btnLink: { textDecoration: 'none', background: '#2563eb', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: '500' },
  btn: { background: '#ef4444', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
  username: { color: '#6b7280', fontSize: '0.9rem' },
};

export default Navbar;

