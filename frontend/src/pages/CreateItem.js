import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';

const CreateItem = () => {
  const [form, setForm] = useState({ title: '', description: '', category: 'bikes', pricePerDay: '', city: '', state: '', pincode: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/items', {
        title: form.title,
        description: form.description,
        category: form.category,
        pricePerDay: Number(form.pricePerDay),
        location: { city: form.city, state: form.state, pincode: form.pincode },
      });
      toast.success('Item listed successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>List an Item for Rent</h2>
        <p style={styles.sub}>Fill in the details of what you want to rent out</p>
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Title</label>
            <input name="title" value={form.title} onChange={handleChange} style={styles.input} placeholder="e.g. Hero Cycle" required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} style={styles.textarea} placeholder="Describe your item..." required />
          </div>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} style={styles.input}>
                {['bikes', 'gadgets', 'tools', 'furniture', 'sports', 'vehicles', 'other'].map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Price per Day (?)</label>
              <input name="pricePerDay" type="number" value={form.pricePerDay} onChange={handleChange} style={styles.input} placeholder="50" required />
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>City</label>
              <input name="city" value={form.city} onChange={handleChange} style={styles.input} placeholder="Mumbai" required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>State</label>
              <input name="state" value={form.state} onChange={handleChange} style={styles.input} placeholder="Maharashtra" />
            </div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Pincode</label>
            <input name="pincode" value={form.pincode} onChange={handleChange} style={styles.input} placeholder="400001" />
          </div>
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Listing...' : 'List Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', padding: '2rem 1rem' },
  card: { background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '600px' },
  title: { fontSize: '1.8rem', fontWeight: 'bold', margin: '0 0 0.25rem', color: '#111' },
  sub: { color: '#6b7280', margin: '0 0 1.5rem' },
  field: { marginBottom: '1rem', flex: 1 },
  label: { display: 'block', fontWeight: '500', marginBottom: '0.4rem', color: '#374151' },
  input: { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box', minHeight: '100px', resize: 'vertical' },
  row: { display: 'flex', gap: '1rem' },
  btn: { width: '100%', padding: '0.75rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' },
};

export default CreateItem;
