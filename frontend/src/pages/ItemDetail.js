import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ItemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await API.get(`/items/${id}`);
        setItem(data.item);
      } catch (err) {
        toast.error('Item not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, navigate]);

  const totalDays = startDate && endDate
    ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
    : 0;

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

  if (loading) return <p style={styles.loading}>Loading...</p>;
  if (!item) return null;

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        <div style={styles.left}>
          <div style={styles.imgBox}>
            {item.images[0] ? <img src={item.images[0]} alt={item.title} style={styles.img} /> : <div style={styles.noImg}>No Image</div>}
          </div>
          <h1 style={styles.title}>{item.title}</h1>
          <span style={styles.badge}>{item.category}</span>
          <p style={styles.location}>?? {item.location.city}, {item.location.state}</p>
          <p style={styles.description}>{item.description}</p>
          <div style={styles.ownerBox}>
            <p style={styles.ownerLabel}>Listed by</p>
            <p style={styles.ownerName}>{item.owner?.name}</p>
            <p style={styles.ownerEmail}>{item.owner?.email}</p>
          </div>
        </div>
        <div style={styles.right}>
          <div style={styles.bookingCard}>
            <p style={styles.price}>?{item.pricePerDay}<span style={styles.perDay}>/day</span></p>
            <form onSubmit={handleBooking}>
              <div style={styles.field}>
                <label style={styles.label}>Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={styles.input} min={new Date().toISOString().split('T')[0]} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={styles.input} min={startDate} required />
              </div>
              {totalDays > 0 && (
                <div style={styles.summary}>
                  <p>Total Days: <strong>{totalDays}</strong></p>
                  <p>Total Amount: <strong>?{totalDays * item.pricePerDay}</strong></p>
                </div>
              )}
              <button type="submit" style={styles.btn} disabled={booking}>
                {booking ? 'Booking...' : 'Book Now'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' },
  left: {},
  imgBox: { height: '350px', background: '#f3f4f6', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  noImg: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af', fontSize: '1.2rem' },
  title: { fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem' },
  badge: { background: '#ede9fe', color: '#7c3aed', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' },
  location: { color: '#6b7280', margin: '0.75rem 0' },
  description: { color: '#374151', lineHeight: 1.7, margin: '1rem 0' },
  ownerBox: { background: '#f9fafb', padding: '1rem', borderRadius: '10px', marginTop: '1rem' },
  ownerLabel: { color: '#9ca3af', fontSize: '0.8rem', margin: '0 0 0.25rem' },
  ownerName: { fontWeight: 'bold', margin: '0 0 0.2rem' },
  ownerEmail: { color: '#6b7280', fontSize: '0.9rem', margin: 0 },
  right: {},
  bookingCard: { background: '#fff', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', position: 'sticky', top: '80px' },
  price: { fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', margin: '0 0 1.5rem' },
  perDay: { fontSize: '1rem', color: '#6b7280', fontWeight: 'normal' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', fontWeight: '500', marginBottom: '0.4rem', color: '#374151' },
  input: { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box' },
  summary: { background: '#eff6ff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' },
  btn: { width: '100%', padding: '0.75rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' },
  loading: { textAlign: 'center', padding: '3rem', color: '#6b7280' },
};

export default ItemDetail;

