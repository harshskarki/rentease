import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Dashboard = ({ darkMode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myItems, setMyItems] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [ownerBookings, setOwnerBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('items');
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  const bg = darkMode ? '#111827' : '#f9fafb';
  const card = darkMode ? '#1f2937' : '#fff';
  const text = darkMode ? '#f9fafb' : '#111827';
  const subText = darkMode ? '#9ca3af' : '#6b7280';
  const border = darkMode ? '#374151' : '#d1d5db';
  const input = { width: '100%', padding: '0.75rem', borderRadius: '8px', border: `1px solid ${border}`, fontSize: '1rem', boxSizing: 'border-box', background: darkMode ? '#374151' : '#fff', color: text };

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [itemsRes, bookingsRes, ownerRes] = await Promise.all([
        API.get('/items/my-items'),
        API.get('/bookings/my-bookings'),
        API.get('/bookings/owner-bookings'),
      ]);
      setMyItems(itemsRes.data.items);
      setMyBookings(bookingsRes.data.bookings);
      setOwnerBookings(ownerRes.data.bookings);
    } catch (err) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await API.delete(`/items/${id}`);
      setMyItems(myItems.filter(i => i._id !== id));
      toast.success('Item deleted');
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}/status`, { status });
      toast.success('Booking updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update booking');
    }
  };

  const markAsCompleted = async (bookingId) => {
    try {
      await API.put(`/bookings/${bookingId}/status`, { status: 'completed' });
      toast.success('Booking marked as completed!');
      fetchData();
    } catch (err) {
      toast.error('Failed to update booking');
    }
  };

  const handlePayment = async (booking) => {
    try {
      const { data } = await API.post('/payments/order', { bookingId: booking._id });
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: 'INR',
        name: 'RentEase',
        description: `Booking for ${booking.item?.title}`,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            await API.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id,
            });
            toast.success('Payment successful!');
            fetchData();
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: '#2563eb' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error('Payment failed');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await API.post('/reviews', {
        itemId: reviewModal.item._id,
        bookingId: reviewModal._id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      toast.success('Review submitted!');
      setReviewModal(null);
      setReviewForm({ rating: 5, comment: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const statusColor = (status) => {
    if (status === 'confirmed') return { bg: '#d1fae5', color: '#065f46' };
    if (status === 'cancelled') return { bg: '#fee2e2', color: '#991b1b' };
    if (status === 'completed') return { bg: '#dbeafe', color: '#1e40af' };
    return { bg: '#fef3c7', color: '#92400e' };
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '3rem', color: subText }}>Loading dashboard...</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem', background: bg, minHeight: '100vh' }}>

      {/* Review Modal */}
      {reviewModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: card, padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 1rem', color: text }}>Review - {reviewModal.item?.title}</h3>
            <form onSubmit={submitReview}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.4rem', color: text }}>Rating</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: star <= reviewForm.rating ? '#f59e0b' : '#d1d5db' }}>
                      ?
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.4rem', color: text }}>Comment</label>
                <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  style={{ ...input, minHeight: '100px', resize: 'vertical' }} placeholder="Share your experience..." required />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" style={{ flex: 1, padding: '0.75rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Submit Review</button>
                <button type="button" onClick={() => setReviewModal(null)} style={{ flex: 1, padding: '0.75rem', background: darkMode ? '#374151' : '#f3f4f6', color: text, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.25rem', color: text }}>Dashboard</h1>
        <p style={{ color: subText, margin: 0 }}>Welcome back, {user?.name}!</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: card, padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>{myItems.length}</p>
          <p style={{ color: subText, margin: '0.25rem 0 0', fontSize: '0.9rem' }}>My Listings</p>
        </div>
        <div style={{ background: card, padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>{myBookings.length}</p>
          <p style={{ color: subText, margin: '0.25rem 0 0', fontSize: '0.9rem' }}>My Bookings</p>
        </div>
        <div style={{ background: card, padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>{ownerBookings.length}</p>
          <p style={{ color: subText, margin: '0.25rem 0 0', fontSize: '0.9rem' }}>Booking Requests</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['items', 'bookings', 'requests'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: `1px solid ${activeTab === tab ? '#2563eb' : border}`, background: activeTab === tab ? '#2563eb' : card, color: activeTab === tab ? '#fff' : text, cursor: 'pointer', fontWeight: '500' }}>
            {tab === 'items' ? 'My Listings' : tab === 'bookings' ? 'My Bookings' : 'Booking Requests'}
          </button>
        ))}
      </div>

      {activeTab === 'items' && (
        <div>
          <Link to="/create-item" style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', marginBottom: '1rem' }}>+ Add New Item</Link>
          {myItems.length === 0 ? <p style={{ textAlign: 'center', padding: '2rem', color: subText }}>No items listed yet</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {myItems.map(item => (
                <div key={item._id} style={{ background: card, padding: '1rem 1.25rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: '600', margin: '0 0 0.2rem', color: text }}>{item.title}</p>
                    <p style={{ color: subText, fontSize: '0.85rem', margin: 0 }}>{item.location.city} - Rs.{item.pricePerDay}/day - {item.category}</p>
                  </div>
                  <button onClick={() => deleteItem(item._id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'bookings' && (
        <div>
          {myBookings.length === 0 ? <p style={{ textAlign: 'center', padding: '2rem', color: subText }}>No bookings yet</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {myBookings.map(b => (
                <div key={b._id} style={{ background: card, padding: '1rem 1.25rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: '600', margin: '0 0 0.2rem', color: text }}>{b.item?.title}</p>
                    <p style={{ color: subText, fontSize: '0.85rem', margin: 0 }}>{new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()} - Rs.{b.totalAmount}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {b.status === 'confirmed' && b.payment?.status !== 'paid' && (
                      <button onClick={() => handlePayment(b)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Pay Now</button>
                    )}
                    {b.status === 'confirmed' && b.payment?.status === 'paid' && (
                      <button onClick={() => markAsCompleted(b._id)} style={{ background: '#d1fae5', color: '#065f46', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Mark Completed</button>
                    )}
                    {b.status === 'completed' && (
                      <button onClick={() => setReviewModal(b)} style={{ background: '#fef3c7', color: '#92400e', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Leave Review</button>
                    )}
                    {b.payment?.status === 'paid' && <span style={{ background: '#d1fae5', color: '#065f46', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500' }}>Paid</span>}
                    <span style={{ background: statusColor(b.status).bg, color: statusColor(b.status).color, padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500' }}>{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div>
          {ownerBookings.length === 0 ? <p style={{ textAlign: 'center', padding: '2rem', color: subText }}>No booking requests yet</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {ownerBookings.map(b => (
                <div key={b._id} style={{ background: card, padding: '1rem 1.25rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: '600', margin: '0 0 0.2rem', color: text }}>{b.item?.title} - booked by {b.renter?.name}</p>
                    <p style={{ color: subText, fontSize: '0.85rem', margin: 0 }}>{new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()} - Rs.{b.totalAmount}</p>
                  </div>
                  {b.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => updateBookingStatus(b._id, 'confirmed')} style={{ background: '#d1fae5', color: '#065f46', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Confirm</button>
                      <button onClick={() => updateBookingStatus(b._id, 'cancelled')} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Reject</button>
                    </div>
                  )}
                  {b.status !== 'pending' && (
                    <span style={{ background: statusColor(b.status).bg, color: statusColor(b.status).color, padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500' }}>{b.status}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
