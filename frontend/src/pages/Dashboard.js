import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myItems, setMyItems] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [ownerBookings, setOwnerBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('items');
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p style={styles.loading}>Loading dashboard...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.sub}>Welcome back, {user?.name}!</p>
      </div>

      <div style={styles.stats}>
        <div style={styles.stat}><span style={styles.statNum}>{myItems.length}</span><span style={styles.statLabel}>My Listings</span></div>
        <div style={styles.stat}><span style={styles.statNum}>{myBookings.length}</span><span style={styles.statLabel}>My Bookings</span></div>
        <div style={styles.stat}><span style={styles.statNum}>{ownerBookings.length}</span><span style={styles.statLabel}>Booking Requests</span></div>
      </div>

      <div style={styles.tabs}>
        {['items', 'bookings', 'requests'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}>
            {tab === 'items' ? 'My Listings' : tab === 'bookings' ? 'My Bookings' : 'Booking Requests'}
          </button>
        ))}
      </div>

      {activeTab === 'items' && (
        <div>
          <Link to="/create-item" style={styles.addBtn}>+ Add New Item</Link>
          {myItems.length === 0 ? <p style={styles.empty}>No items listed yet</p> : (
            <div style={styles.list}>
              {myItems.map(item => (
                <div key={item._id} style={styles.listItem}>
                  <div>
                    <p style={styles.itemTitle}>{item.title}</p>
                    <p style={styles.itemSub}>{item.location.city} • ?{item.pricePerDay}/day • {item.category}</p>
                  </div>
                  <button onClick={() => deleteItem(item._id)} style={styles.deleteBtn}>Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'bookings' && (
        <div>
          {myBookings.length === 0 ? <p style={styles.empty}>No bookings yet</p> : (
            <div style={styles.list}>
              {myBookings.map(b => (
                <div key={b._id} style={styles.listItem}>
                  <div>
                    <p style={styles.itemTitle}>{b.item?.title}</p>
                    <p style={styles.itemSub}>{new Date(b.startDate).toLocaleDateString()} ? {new Date(b.endDate).toLocaleDateString()} • ?{b.totalAmount}</p>
                  </div>
                  <span style={{ ...styles.statusBadge, background: b.status === 'confirmed' ? '#d1fae5' : b.status === 'cancelled' ? '#fee2e2' : '#fef3c7', color: b.status === 'confirmed' ? '#065f46' : b.status === 'cancelled' ? '#991b1b' : '#92400e' }}>{b.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div>
          {ownerBookings.length === 0 ? <p style={styles.empty}>No booking requests yet</p> : (
            <div style={styles.list}>
              {ownerBookings.map(b => (
                <div key={b._id} style={styles.listItem}>
                  <div>
                    <p style={styles.itemTitle}>{b.item?.title} — booked by {b.renter?.name}</p>
                    <p style={styles.itemSub}>{new Date(b.startDate).toLocaleDateString()} ? {new Date(b.endDate).toLocaleDateString()} • ?{b.totalAmount}</p>
                  </div>
                  {b.status === 'pending' && (
                    <div style={styles.actions}>
                      <button onClick={() => updateBookingStatus(b._id, 'confirmed')} style={styles.confirmBtn}>Confirm</button>
                      <button onClick={() => updateBookingStatus(b._id, 'cancelled')} style={styles.rejectBtn}>Reject</button>
                    </div>
                  )}
                  {b.status !== 'pending' && (
                    <span style={{ ...styles.statusBadge, background: b.status === 'confirmed' ? '#d1fae5' : '#fee2e2', color: b.status === 'confirmed' ? '#065f46' : '#991b1b' }}>{b.status}</span>
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

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' },
  header: { marginBottom: '1.5rem' },
  title: { fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.25rem' },
  sub: { color: '#6b7280', margin: 0 },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' },
  stat: { background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  statNum: { fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' },
  statLabel: { color: '#6b7280', fontSize: '0.9rem' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  tab: { padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontWeight: '500' },
  tabActive: { background: '#2563eb', color: '#fff', border: '1px solid #2563eb' },
  addBtn: { display: 'inline-block', background: '#2563eb', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', marginBottom: '1rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  listItem: { background: '#fff', padding: '1rem 1.25rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontWeight: '600', margin: '0 0 0.2rem' },
  itemSub: { color: '#6b7280', fontSize: '0.85rem', margin: 0 },
  deleteBtn: { background: '#fee2e2', color: '#991b1b', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' },
  statusBadge: { padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500' },
  actions: { display: 'flex', gap: '0.5rem' },
  confirmBtn: { background: '#d1fae5', color: '#065f46', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' },
  rejectBtn: { background: '#fee2e2', color: '#991b1b', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' },
  empty: { textAlign: 'center', padding: '2rem', color: '#9ca3af' },
  loading: { textAlign: 'center', padding: '3rem', color: '#6b7280' },
};

export default Dashboard;

