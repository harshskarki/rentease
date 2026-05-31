import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = ({ darkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({});
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', city: '', bio: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(true);

  const bg = darkMode ? '#111827' : '#f9fafb';
  const card = darkMode ? '#1f2937' : '#fff';
  const text = darkMode ? '#f9fafb' : '#111827';
  const subText = darkMode ? '#9ca3af' : '#6b7280';
  const border = darkMode ? '#374151' : '#d1d5db';
  const input = { width: '100%', padding: '0.75rem', borderRadius: '8px', border: `1px solid ${border}`, fontSize: '1rem', boxSizing: 'border-box', background: darkMode ? '#374151' : '#fff', color: text };

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/users/profile');
      setProfile(data.user);
      setStats(data.stats);
      setForm({ name: data.user.name, phone: data.user.phone || '', city: data.user.city || '', bio: data.user.bio || '' });
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('phone', form.phone);
      formData.append('city', form.city);
      formData.append('bio', form.bio);
      if (avatar) formData.append('avatar', avatar);
      const { data } = await API.put('/users/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProfile(data.user);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await API.put('/users/change-password', passwordForm);
      toast.success('Password changed successfully!');
      setChangingPassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone!')) return;
    try {
      await API.delete('/users/delete-account');
      logout();
      toast.success('Account deleted');
      navigate('/');
    } catch (err) {
      toast.error('Failed to delete account');
    }
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '3rem', color: subText }}>Loading profile...</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem', background: bg, minHeight: '100vh' }}>

      {/* Profile Card */}
      <div style={{ background: card, borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            {avatarPreview || profile?.avatar ? (
              <img src={avatarPreview || profile?.avatar} alt="avatar" style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #2563eb' }} />
            ) : (
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#fff', fontWeight: 'bold' }}>
                {profile?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h2 style={{ margin: '0 0 0.25rem', color: text, fontSize: '1.5rem', fontWeight: 'bold' }}>{profile?.name}</h2>
            <p style={{ margin: '0 0 0.25rem', color: subText }}>{profile?.email}</p>
            {profile?.city && <p style={{ margin: '0', color: subText }}>City: {profile?.city}</p>}
            <p style={{ margin: '0.25rem 0 0', color: subText, fontSize: '0.85rem' }}>Member since {new Date(profile?.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</p>
          </div>
          <button onClick={() => setEditing(!editing)} style={{ marginLeft: 'auto', background: '#2563eb', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {profile?.bio && !editing && <p style={{ color: subText, margin: '0 0 1rem', fontStyle: 'italic' }}>{profile?.bio}</p>}

        {editing && (
          <form onSubmit={handleUpdate}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.4rem', color: text }}>Profile Picture</label>
              <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ color: text }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.4rem', color: text }}>Full Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={input} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.4rem', color: text }}>Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={input} placeholder="9999999999" />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.4rem', color: text }}>City</label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} style={input} placeholder="Mumbai" />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.4rem', color: text }}>Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} style={{ ...input, minHeight: '80px', resize: 'vertical' }} placeholder="Tell others about yourself..." />
            </div>
            <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Save Changes</button>
          </form>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: card, padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>{stats.totalItems || 0}</p>
          <p style={{ color: subText, margin: '0.25rem 0 0', fontSize: '0.9rem' }}>Items Listed</p>
        </div>
        <div style={{ background: card, padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>{stats.totalBookings || 0}</p>
          <p style={{ color: subText, margin: '0.25rem 0 0', fontSize: '0.9rem' }}>Bookings Made</p>
        </div>
        <div style={{ background: card, padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>{profile?.rating || 0}</p>
          <p style={{ color: subText, margin: '0.25rem 0 0', fontSize: '0.9rem' }}>Rating</p>
        </div>
      </div>

      {/* Change Password */}
      <div style={{ background: card, borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: text }}>Change Password</h3>
          <button onClick={() => setChangingPassword(!changingPassword)} style={{ background: darkMode ? '#374151' : '#f3f4f6', color: text, border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
            {changingPassword ? 'Cancel' : 'Change'}
          </button>
        </div>
        {changingPassword && (
          <form onSubmit={handlePasswordChange} style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.4rem', color: text }}>Current Password</label>
              <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} style={input} required />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.4rem', color: text }}>New Password</label>
              <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} style={input} required />
            </div>
            <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Update Password</button>
          </form>
        )}
      </div>

      {/* Delete Account */}
      <div style={{ background: card, borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #fee2e2' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#dc2626' }}>Danger Zone</h3>
        <p style={{ color: subText, margin: '0 0 1rem', fontSize: '0.9rem' }}>Once you delete your account, all your data will be permanently removed.</p>
        <button onClick={handleDeleteAccount} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Delete Account</button>
      </div>

    </div>
  );
};

export default Profile;
