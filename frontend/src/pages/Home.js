import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const Home = ({ darkMode }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchItems();
  }, [category]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category) params.category = category;
      if (search) params.city = search;
      const { data } = await API.get('/items', { params });
      setItems(data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const bg = darkMode ? '#111827' : '#f9fafb';
  const card = darkMode ? '#1f2937' : '#fff';
  const text = darkMode ? '#f9fafb' : '#111827';
  const subText = darkMode ? '#9ca3af' : '#6b7280';
  const border = darkMode ? '#374151' : '#d1d5db';

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', background: bg, minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff', borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center', margin: '2rem 0' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 0.5rem' }}>Rent Anything, Anytime</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: '0 0 1.5rem' }}>Find bikes, gadgets, tools and more near you</p>
        <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: '500px', margin: '0 auto', gap: '0.5rem' }}>
          <input type="text" placeholder="Search by city..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', fontSize: '1rem' }} />
          <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Search</button>
        </form>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '1rem 0' }}>
        {['', 'bikes', 'gadgets', 'tools', 'furniture', 'sports', 'vehicles', 'other'].map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}
            style={{ padding: '0.5rem 1rem', borderRadius: '20px', border: `1px solid ${category === cat ? '#2563eb' : border}`, background: category === cat ? '#2563eb' : card, color: category === cat ? '#fff' : text, cursor: 'pointer', fontWeight: '500' }}>
            {cat === '' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: subText }}>Loading items...</p>
      ) : items.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: subText }}>No items found. Be the first to list one!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', margin: '1rem 0 3rem' }}>
          {items.map((item) => (
            <Link to={`/items/${item._id}`} key={item._id} style={{ textDecoration: 'none', color: 'inherit', background: card, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'block' }}>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
