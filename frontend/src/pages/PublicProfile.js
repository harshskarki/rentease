import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';

const PublicProfile = ({ darkMode }) => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const bg = darkMode ? '#111827' : '#f9fafb';
  const card = darkMode ? '#1f2937' : '#fff';
  const text = darkMode ? '#f9fafb' : '#111827';
  const subText = darkMode ? '#9ca3af' : '#6b7280';

  useEffect(() => {
    fetchPublicProfile();
  }, [id]);

  const fetchPublicProfile = async () => {
    try {
      const { data } = await API.get(`/users/public/${id}`);
      setProfile(data.user);
      setItems(data.items);
      setStats(data.stats);
    } catch (err) {
      toast.error('User not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '3rem', color: subText }}>Loading...</p>;
  if (!profile) return null;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem', background: bg, minHeight: '100vh' }}>

      {/* Profile Header */}
      <div style={{ background: card, borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {profile.avatar ? (
            <img src={profile.avatar} alt="avatar" style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #2563eb' }} />
          ) : (
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#fff', fontWeight: 'bold' }}>
              {profile.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 style={{ margin: '0 0 0.25rem', color: text, fontSize: '1.5rem', fontWeight: 'bold' }}>{profile.name}</h2>
            {profile.city && <p style={{ margin: '0 0 0.25rem', color: subText }}>Location: {profile.city}</p>}
            <p style={{ margin: '0', color: subText, fontSize: '0.85rem' }}>Member since {new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</p>
          </div>
        </div>
        {profile.bio && <p style={{ color: subText, margin: '1rem 0 0', fontStyle: 'italic' }}>{profile.bio}</p>}
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
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>{profile.rating || 0}</p>
          <p style={{ color: subText, margin: '0.25rem 0 0', fontSize: '0.9rem' }}>Rating</p>
        </div>
      </div>

      {/* Listings */}
      <div style={{ background: card, borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 1rem', color: text }}>Listings by {profile.name}</h3>
        {items.length === 0 ? (
          <p style={{ color: subText, textAlign: 'center', padding: '2rem' }}>No items listed yet</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {items.map(item => (
              <Link to={`/items/${item._id}`} key={item._id} style={{ textDecoration: 'none', color: 'inherit', background: darkMode ? '#374151' : '#f9fafb', borderRadius: '10px', overflow: 'hidden', display: 'block' }}>
                <div style={{ height: '150px', background: darkMode ? '#4b5563' : '#e5e7eb' }}>
                  {item.images[0] ? <img src={item.images[0]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: subText }}>No Image</div>}
                </div>
                <div style={{ padding: '0.75rem' }}>
                  <p style={{ fontWeight: '600', margin: '0 0 0.25rem', color: text }}>{item.title}</p>
                  <p style={{ color: '#2563eb', fontWeight: 'bold', margin: 0 }}>Rs.{item.pricePerDay}/day</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;
