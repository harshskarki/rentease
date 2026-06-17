import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const VerifyOTP = ({ darkMode }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const bg = darkMode ? '#111827' : '#f9fafb';
  const card = darkMode ? '#1f2937' : '#fff';
  const text = darkMode ? '#f9fafb' : '#111827';
  const subText = darkMode ? '#9ca3af' : '#6b7280';
  const border = darkMode ? '#374151' : '#d1d5db';

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/verify-otp', { otp });
      toast.success('Email verified successfully!');
      const updatedUser = { ...user, isVerified: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      navigate('/');
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await API.post('/auth/resend-otp');
      toast.success('OTP resent! Check your email.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '1rem', background: bg }}>
      <div style={{ background: card, padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0 0 0.5rem', color: text }}>Verify Your Email</h2>
        <p style={{ color: subText, margin: '0 0 1.5rem' }}>We sent a 6-digit code to your email. Enter it below to verify your account.</p>
        <form onSubmit={handleVerify}>
          <input
            type="text"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: `1px solid ${border}`, fontSize: '1.5rem', textAlign: 'center', letterSpacing: '8px', boxSizing: 'border-box', background: darkMode ? '#374151' : '#fff', color: text, marginBottom: '1rem' }}
            required
          />
          <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginBottom: '1rem' }} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
        <button onClick={handleResend} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: '500' }} disabled={resending}>
          {resending ? 'Resending...' : "Didn't receive code? Resend OTP"}
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;
