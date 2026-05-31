import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Wishlist = ({ darkMode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const bg = darkMode ? '#111827' : '#f9fafb';
  const card = darkMode ? '#1f2937' : '#fff';
  const text = darkMode ? '#f9fafb' : '#111827';
  const subText = darkMode ? '#9ca3af' : '#6b7280';

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const { data } = await API.get('/wishlist');
      setWishlist(data.wishlist);
    } catch (err) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId) => {
    try {
      await API.post(`/wishlist/toggle/${itemId}`);
      setWishlist(wishlist.filter(item => item._id !== itemId));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '3rem', color: subText }}>Loading wishlist...</p>;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem', background: bg, minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem', color: text }}>My Wishlist</h1>
      <p style={{ color: subText, margin: '0 0 2rem' }}>Items you have saved for later</p>

      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: card, borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <p style={{ fontSize: '1.2rem', color: subText, margin: '0 0 1rem' }}>No items in your wishlist yet!</p>
          <Link to="/" style={{ background: '#2563eb', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '500' }}>Browse Items</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {wishlist.map(item => (
            <div key={item._id} style={{ background: card, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <Link to={`/items/${item._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ height: '180px', background: darkMode ? '#374151' : '#f3f4f6' }}>
                  {item.images[0] ? <img src={item.images[0]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: subText }}>No Image</div>}
                </div>
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ fontWeight: 'bold', fontSize: '1rem', margin: '0 0 0.25rem', color: text }}>{item.title}</h3>
                  <p style={{ color: subText, fontSize: '0.85rem', margin: '0 0 0.5rem' }}>{item.location.city}</p>
                  <p style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '1.1rem', margin: '0 0 0.5rem' }}>Rs.{item.pricePerDay}/day</p>
                  <span style={{ background: '#ede9fe', color: '#7c3aed', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem' }}>{item.category}</span>
                </div>
              </Link>
              <div style={{ padding: '0 1rem 1rem' }}>
                <button onClick={() => removeFromWishlist(item._id)} style={{ width: '100%', padding: '0.5rem', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
                  Remove from Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
