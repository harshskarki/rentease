import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = ({ darkMode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const bg = darkMode ? '#111827' : '#f9fafb';
  const card = darkMode ? '#1f2937' : '#fff';
  const text = darkMode ? '#f9fafb' : '#111827';
  const subText = darkMode ? '#9ca3af' : '#6b7280';
  const border = darkMode ? '#374151' : '#d1d5db';

  useEffect(() => {
    if (!user || user.role !== 'admin') { toast.error('Admin access only'); navigate('/'); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, itemsRes, bookingsRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users'),
        API.get('/admin/items'),
        API.get('/admin/bookings'),
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setItems(itemsRes.data.items);
      setBookings(bookingsRes.data.bookings);
    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user and all their data?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await API.delete(`/admin/items/${id}`);
      setItems(items.filter(i => i._id !== id));
      toast.success('Item deleted');
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '3rem', color: subText }}>Loading admin dashboard...</p>;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem', background: bg, minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.25rem', color: text }}>Admin Dashboard</h1>
      <p style={{ color: subText, margin: '0 0 1.5rem' }}>Manage your platform</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' }} className="stats-grid">
        <div style={{ background: card, padding: '1.25rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>{stats.totalUsers}</p>
          <p style={{ color: subText, margin: '0.25rem 0 0', fontSize: '0.8rem' }}>Users</p>
        </div>
        <div style={{ background: card, padding: '1.25rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>{stats.totalItems}</p>
          <p style={{ color: subText, margin: '0.25rem 0 0', fontSize: '0.8rem' }}>Items</p>
        </div>
        <div style={{ background: card, padding: '1.25rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>{stats.totalBookings}</p>
          <p style={{ color: subText, margin: '0.25rem 0 0', fontSize: '0.8rem' }}>Bookings</p>
        </div>
        <div style={{ background: card, padding: '1.25rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>{stats.totalReviews}</p>
          <p style={{ color: subText, margin: '0.25rem 0 0', fontSize: '0.8rem' }}>Reviews</p>
        </div>
        <div style={{ background: card, padding: '1.25rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#059669', margin: 0 }}>Rs.{stats.totalRevenue}</p>
          <p style={{ color: subText, margin: '0.25rem 0 0', fontSize: '0.8rem' }}>Revenue</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['overview', 'users', 'items', 'bookings'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: `1px solid ${activeTab === tab ? '#2563eb' : border}`, background: activeTab === tab ? '#2563eb' : card, color: activeTab === tab ? '#fff' : text, cursor: 'pointer', fontWeight: '500', textTransform: 'capitalize' }}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div style={{ background: card, padding: '2rem', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <p style={{ color: subText }}>Platform is running smoothly! Use the tabs above to manage users, items, and bookings.</p>
        </div>
      )}

      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {users.map(u => (
            <div key={u._id} style={{ background: card, padding: '1rem 1.25rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: '600', margin: '0 0 0.2rem', color: text }}>{u.name} {u.role === 'admin' && <span style={{ background: '#fef3c7', color: '#92400e', padding: '0.1rem 0.5rem', borderRadius: '10px', fontSize: '0.7rem', marginLeft: '0.5rem' }}>ADMIN</span>}</p>
                <p style={{ color: subText, fontSize: '0.85rem', margin: 0 }}>{u.email} - {u.phone || 'No phone'} - Joined {new Date(u.createdAt).toLocaleDateString()}</p>
              </div>
              {u.role !== 'admin' && (
                <button onClick={() => deleteUser(u._id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Delete</button>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'items' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map(item => (
            <div key={item._id} style={{ background: card, padding: '1rem 1.25rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: '600', margin: '0 0 0.2rem', color: text }}>{item.title}</p>
                <p style={{ color: subText, fontSize: '0.85rem', margin: 0 }}>{item.location.city} - Rs.{item.pricePerDay}/day - Owner: {item.owner?.name}</p>
              </div>
              <button onClick={() => deleteItem(item._id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'bookings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {bookings.map(b => (
            <div key={b._id} style={{ background: card, padding: '1rem 1.25rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <p style={{ fontWeight: '600', margin: '0 0 0.2rem', color: text }}>{b.item?.title}</p>
              <p style={{ color: subText, fontSize: '0.85rem', margin: 0 }}>Renter: {b.renter?.name} - Owner: {b.owner?.name} - Rs.{b.totalAmount} - Status: {b.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
