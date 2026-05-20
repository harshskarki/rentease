import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const Home = () => {
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

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Rent Anything, Anytime</h1>
        <p style={styles.heroSub}>Find bikes, gadgets, tools and more near you</p>
        <form onSubmit={handleSearch} style={styles.searchBar}>
          <input
            type="text"
            placeholder="Search by city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchBtn}>Search</button>
        </form>
      </div>

      <div style={styles.filters}>
        {['', 'bikes', 'gadgets', 'tools', 'furniture', 'sports', 'vehicles', 'other'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{ ...styles.filterBtn, ...(category === cat ? styles.filterBtnActive : {}) }}
          >
            {cat === '' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={styles.loading}>Loading items...</p>
      ) : items.length === 0 ? (
        <p style={styles.empty}>No items found. Be the first to list one!</p>
      ) : (
        <div style={styles.grid}>
          {items.map((item) => (
            <Link to={`/items/${item._id}`} key={item._id} style={styles.card}>
              <div style={styles.cardImg}>
                {item.images[0] ? <img src={item.images[0]} alt={item.title} style={styles.img} /> : <div style={styles.noImg}>No Image</div>}
              </div>
              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{item.title}</h3>
                <p style={styles.cardCity}>{item.location.city}</p>
                <p style={styles.cardPrice}>?{item.pricePerDay}/day</p>
                <span style={styles.badge}>{item.category}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' },
  hero: { background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff', borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center', margin: '2rem 0' },
  heroTitle: { fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 0.5rem' },
  heroSub: { fontSize: '1.1rem', opacity: 0.9, margin: '0 0 1.5rem' },
  searchBar: { display: 'flex', maxWidth: '500px', margin: '0 auto', gap: '0.5rem' },
  searchInput: { flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', fontSize: '1rem' },
  searchBtn: { padding: '0.75rem 1.5rem', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  filters: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '1rem 0' },
  filterBtn: { padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontWeight: '500' },
  filterBtnActive: { background: '#2563eb', color: '#fff', border: '1px solid #2563eb' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', margin: '1rem 0 3rem' },
  card: { textDecoration: 'none', color: 'inherit', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden', transition: 'transform 0.2s', display: 'block' },
  cardImg: { height: '180px', background: '#f3f4f6' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  noImg: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' },
  cardBody: { padding: '1rem' },
  cardTitle: { fontWeight: 'bold', fontSize: '1rem', margin: '0 0 0.25rem' },
  cardCity: { color: '#6b7280', fontSize: '0.85rem', margin: '0 0 0.5rem' },
  cardPrice: { color: '#2563eb', fontWeight: 'bold', fontSize: '1.1rem', margin: '0 0 0.5rem' },
  badge: { background: '#ede9fe', color: '#7c3aed', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem' },
  loading: { textAlign: 'center', padding: '3rem', color: '#6b7280' },
  empty: { textAlign: 'center', padding: '3rem', color: '#6b7280' },
};

export default Home;

