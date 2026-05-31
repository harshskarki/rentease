import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ItemDetail = ({ darkMode }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [booking, setBooking] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const bg = darkMode ? '#111827' : '#f9fafb';
  const card = darkMode ? '#1f2937' : '#fff';
  const text = darkMode ? '#f9fafb' : '#111827';
  const subText = darkMode ? '#9ca3af' : '#6b7280';
  const border = darkMode ? '#374151' : '#d1d5db';

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await API.get(`/items/${id}`);
        setItem(data.item);
        if (user) {
          const wishlistRes = await API.get('/wishlist');
          const isWishlisted = wishlistRes.data.wishlist.some(w => w._id === id);
          setWishlisted(isWishlisted);
        }
      } catch (err) {
        toast.error('Item not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, navigate, user]);

  const totalDays = startDate && endDate
    ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
    : 0;

  const handleWishlist = async () => {
    if (!user) { toast.error('Please login to save items'); navigate('/login'); return; }
    try {
      const { data } = await API.post(`/wishlist/toggle/${id}`);
      setWishlisted(data.wishlisted);
      toast.success(data.wishlisted ? 'Added to wishlist!' : 'Removed from wishlist!');
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to book'); navigate('/login'); return; }
    setBooking(true);
    try {
      await API.post('/bookings', { itemId: id, startDate, endDate });
      toast.success('Booking created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '3rem', color: subText }}>Loading...</p>;
  if (!item) return null;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem', background: bg, minHeight: '100vh' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
        <div>
          <div style={{ height: '350px', background: darkMode ? '#374151' : '#f3f4f6', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' }}>
            {item.images[0] ? <img src={item.images[0]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: subText, fontSize: '1.2rem' }}>No Image</div>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem', color: text }}>{item.title}</h1>
            <button onClick={handleWishlist} style={{ background: wishlisted ? '#fee2e2' : darkMode ? '#374151' : '#f3f4f6', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '1.2rem', color: wishlisted ? '#dc2626' : subText }}>
              {wishlisted ? 'Saved' : 'Save'}
            </button>
          </div>
          <span style={{ background: '#ede9fe', color: '#7c3aed', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}>{item.category}</span>
          <p style={{ color: subText, margin: '0.75rem 0' }}>Location: {item.location.city}, {item.location.state}</p>
          <p style={{ color: text, lineHeight: 1.7, margin: '1rem 0' }}>{item.description}</p>
          <Link to={`/users/${item.owner?._id}`} style={{ display: 'block', background: darkMode ? '#374151' : '#f9fafb', padding: '1rem', borderRadius: '10px', marginTop: '1rem', textDecoration: 'none' }}>
            <p style={{ color: subText, fontSize: '0.8rem', margin: '0 0 0.25rem' }}>Listed by</p>
            <p style={{ fontWeight: 'bold', margin: '0 0 0.2rem', color: text }}>{item.owner?.name}</p>
            <p style={{ color: subText, fontSize: '0.9rem', margin: 0 }}>{item.owner?.email}</p>
          </Link>
        </div>
        <div>
          <div style={{ background: card, padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', position: 'sticky', top: '80px' }}>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', margin: '0 0 1.5rem' }}>Rs.{item.pricePerDay}<span style={{ fontSize: '1rem', color: subText, fontWeight: 'normal' }}>/day</span></p>
            <form onSubmit={handleBooking}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.4rem', color: text }}>Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: `1px solid ${border}`, fontSize: '1rem', boxSizing: 'border-box', background: darkMode ? '#374151' : '#fff', color: text }} min={new Date().toISOString().split('T')[0]} required />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.4rem', color: text }}>End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: `1px solid ${border}`, fontSize: '1rem', boxSizing: 'border-box', background: darkMode ? '#374151' : '#fff', color: text }} min={startDate} required />
              </div>
              {totalDays > 0 && (
                <div style={{ background: darkMode ? '#1e3a5f' : '#eff6ff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                  <p style={{ color: text, margin: '0 0 0.25rem' }}>Total Days: <strong>{totalDays}</strong></p>
                  <p style={{ color: text, margin: 0 }}>Total Amount: <strong>Rs.{totalDays * item.pricePerDay}</strong></p>
                </div>
              )}
              <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }} disabled={booking}>
                {booking ? 'Booking...' : 'Book Now'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
