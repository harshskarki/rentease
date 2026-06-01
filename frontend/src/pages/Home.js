import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const Home = ({ darkMode }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const bg = darkMode ? '#111827' : '#f9fafb';
  const card = darkMode ? '#1f2937' : '#fff';
  const text = darkMode ? '#f9fafb' : '#111827';
  const subText = darkMode ? '#9ca3af' : '#6b7280';
  const border = darkMode ? '#374151' : '#d1d5db';

  useEffect(() => {
    fetchItems();
  }, [category, page]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 6 };
      if (category) params.category = category;
      if (search) params.city = search;
      const { data } = await API.get('/items', { params });
      setItems(data.items);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.length >= 1) {
      try {
        const { data } = await API.get(`/search/autocomplete?q=${value}`);
        setSuggestions(data.suggestions);
        setShowSuggestions(true);
      } catch (err) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearch(suggestion.title);
    setShowSuggestions(false);
    window.location.href = `/items/${suggestion.id}`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setShowSuggestions(false);
    fetchItems();
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', background: bg, minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff', borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center', margin: '2rem 0' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 0.5rem' }}>Rent Anything, Anytime</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: '0 0 1.5rem' }}>Find bikes, gadgets, tools and more near you</p>
        <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: '500px', margin: '0 auto', gap: '0.5rem', position: 'relative' }} ref={searchRef}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              placeholder="Search items, cities, categories..."
              value={search}
              onChange={handleSearchChange}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 100, marginTop: '4px', overflow: 'hidden' }}>
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    style={{ padding: '0.75rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid #f3f4f6', background: '#fff', color: '#111' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    {s.image && <img src={s.image} alt={s.title} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />}
                    <div>
                      <p style={{ margin: 0, fontWeight: '500', fontSize: '0.9rem' }}>{s.title}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>{s.city} - Rs.{s.pricePerDay}/day</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Search</button>
        </form>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '1rem 0' }}>
        {['', 'bikes', 'gadgets', 'tools', 'furniture', 'sports', 'vehicles', 'other'].map((cat) => (
          <button key={cat} onClick={() => handleCategory(cat)}
            style={{ padding: '0.5rem 1rem', borderRadius: '20px', border: `1px solid ${category === cat ? '#2563eb' : border}`, background: category === cat ? '#2563eb' : card, color: category === cat ? '#fff' : text, cursor: 'pointer', fontWeight: '500' }}>
            {cat === '' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {total > 0 && <p style={{ color: subText, margin: '0.5rem 0' }}>Showing {items.length} of {total} items</p>}

      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: subText }}>Loading items...</p>
      ) : items.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: subText }}>No items found. Be the first to list one!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', margin: '1rem 0' }}>
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

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', margin: '2rem 0 3rem' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: `1px solid ${border}`, background: card, color: text, cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: `1px solid ${p === page ? '#2563eb' : border}`, background: p === page ? '#2563eb' : card, color: p === page ? '#fff' : text, cursor: 'pointer', fontWeight: p === page ? 'bold' : 'normal' }}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: `1px solid ${border}`, background: card, color: text, cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
