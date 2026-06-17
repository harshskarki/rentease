import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import API from '../services/api';

const Register = ({ darkMode }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const bg = darkMode ? '#111827' : '#f9fafb';
  const card = darkMode ? '#1f2937' : '#fff';
  const text = darkMode ? '#f9fafb' : '#111827';
  const subText = darkMode ? '#9ca3af' : '#6b7280';
  const border = darkMode ? '#374151' : '#d1d5db';
  const input = { width: '100%', padding: '0.75rem', borderRadius: '8px', border: `1px solid ${border}`, fontSize: '1rem', boxSizing: 'border-box', background: darkMode ? '#374151' : '#fff', color: text };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.devOtp) {
        toast.success(`Account created! Test mode OTP: ${data.devOtp}`, { duration: 10000 });
      } else {
        toast.success('Account created! Please verify your email.');
      }
      navigate('/verify-otp');
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '1rem', background: bg }}>
      <div style={{ background: card, padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0 0 0.25rem', color: text }}>Create Account</h2>
        <p style={{ color: subText, margin: '0 0 1.5rem' }}>Join RentEase today</p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.4rem', color: text }}>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} style={input} placeholder="Harsh Vardhan" required />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.4rem', color: text }}>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} style={input} placeholder="you@example.com" required />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.4rem', color: text }}>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} style={input} placeholder="9999999999" />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.4rem', color: text }}>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} style={input} placeholder="********" required />
          </div>
          <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', color: subText }}>Already have an account? <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
