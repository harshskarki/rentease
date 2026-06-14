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
  const [currentImage, setCurrentImage] = useState(0);
  const [bookedDates, setBookedDates] = useState([]);
  const [reviews, setReviews] = useState([]);

  const bg = darkMode ? '#111827' : '#f9fafb';
  const card = darkMode ? '#1f2937' : '#fff';
  const text = darkMode ? '#f9fafb' : '#111827';
  const subText = darkMode ? '#9ca3af' : '#6b7280';
  const border = darkMode ? '#374151' : '#d1d5db';

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const [itemRes, datesRes, reviewsRes] = await Promise.all([
          API.get(`/items/${id}`),
          API.get(`/bookings/booked-dates/${id}`),
          API.get(`/reviews/${id}`),
        ]);
        setItem(itemRes.data.item);
        setBookedDates(datesRes.data.bookedDates);
        setReviews(reviewsRes.data.reviews);
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

  const isDateBooked = (date) => {
    return bookedDates.some(b => {
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);
      const check = new Date(date);
      return check >= start && check <= end;
    });
  };

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
    if (isDateBooked(startDate) || isDateBooked(endDate)) {
      toast.error('Selected dates overlap with an existing booking!');
      return;
    }
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

  const prevImage = () => setCurrentImage(i => (i === 0 ? item.images.length - 1 : i - 1));
  const nextImage = () => setCurrentImage(i => (i === item.images.length - 1 ? 0 : i + 1));

  const renderStars = (rating) => {
  return [1,2,3,4,5].map(star => (
    <span key={star} style={{ color: star <= rating ? '#f59e0b' : '#d1d5db', fontSize: '1.1rem' }}>
      {star <= rating ? '\u2605' : '\u2606'}
    </span>
  ));
};

  if (loading) return <p style={{ textAlign: 'center', padding: '3rem', color: subText }}>Loading...</p>;
  if (!item) return null;

  const images = item.images.length > 0 ? item.images : [];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem', background: bg, minHeight: '100vh' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '2rem' }}>
        <div>
          {/* Image Carousel */}
          <div style={{ position: 'relative', height: '400px', background: darkMode ? '#374151' : '#f3f4f6', borderRadius: '16px', overflow: 'hidden', marginBottom: '1rem' }}>
            {images.length > 0 ? (
              <>
                <img src={images[currentImage]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s ease' }} />
                {images.length > 1 && (
                  <>
                    <button onClick={prevImage} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&#8249;</button>
                    <button onClick={nextImage} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&#8250;</button>
                    <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                      {images.map((_, i) => (
                        <div key={i} onClick={() => setCurrentImage(i)}
                          style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === currentImage ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'background 0.3s' }} />
                      ))}
                    </div>
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '0.25rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem' }}>
                      {currentImage + 1} / {images.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: subText, fontSize: '1.2rem' }}>No Image</div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              {images.map((img, i) => (
                <img key={i} src={img} alt={`thumbnail ${i}`} onClick={() => setCurrentImage(i)}
                  style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', border: i === currentImage ? '3px solid #2563eb' : '3px solid transparent', opacity: i === currentImage ? 1 : 0.6, transition: 'all 0.2s', flexShrink: 0 }} />
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem', color: text }}>{item.title}</h1>
            <button onClick={handleWishlist} style={{ background: wishlisted ? '#fee2e2' : darkMode ? '#374151' : '#f3f4f6', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', color: wishlisted ? '#dc2626' : subText }}>
              {wishlisted ? 'Saved' : 'Save'}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
            <span style={{ background: '#ede9fe', color: '#7c3aed', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}>{item.category}</span>
            {item.numReviews > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: subText, fontSize: '0.9rem' }}>
                {renderStars(item.rating)} <span>({item.numReviews} reviews)</span>
              </span>
            )}
          </div>
          <p style={{ color: subText, margin: '0.75rem 0' }}>Location: {item.location.city}, {item.location.state}</p>
          <p style={{ color: text, lineHeight: 1.7, margin: '1rem 0' }}>{item.description}</p>

          {/* Booked Dates */}
          {bookedDates.length > 0 && (
            <div style={{ background: darkMode ? '#374151' : '#fef3c7', padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
              <p style={{ fontWeight: '600', color: '#92400e', margin: '0 0 0.5rem' }}>Already Booked Dates:</p>
              {bookedDates.map((b, i) => (
                <p key={i} style={{ color: '#92400e', margin: '0.2rem 0', fontSize: '0.9rem' }}>
                  {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
                </p>
              ))}
            </div>
          )}

          <Link to={`/users/${item.owner?._id}`} style={{ display: 'block', background: darkMode ? '#374151' : '#f9fafb', padding: '1rem', borderRadius: '10px', marginTop: '1rem', textDecoration: 'none' }}>
            <p style={{ color: subText, fontSize: '0.8rem', margin: '0 0 0.25rem' }}>Listed by</p>
            <p style={{ fontWeight: 'bold', margin: '0 0 0.2rem', color: text }}>{item.owner?.name}</p>
            <p style={{ color: subText, fontSize: '0.9rem', margin: 0 }}>{item.owner?.email}</p>
          </Link>

          {/* Reviews Section */}
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ color: text, margin: '0 0 1rem', fontSize: '1.3rem' }}>Reviews {reviews.length > 0 && `(${reviews.length})`}</h3>
            {reviews.length === 0 ? (
              <p style={{ color: subText }}>No reviews yet. Be the first to review!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reviews.map(review => (
                  <div key={review._id} style={{ background: card, padding: '1rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      {review.user?.avatar ? (
                        <img src={review.user.avatar} alt={review.user.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' }}>
                          {review.user?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p style={{ fontWeight: '600', margin: 0, color: text }}>{review.user?.name}</p>
                        <div style={{ display: 'flex', gap: '2px' }}>{renderStars(review.rating)}</div>
                      </div>
                      <p style={{ color: subText, fontSize: '0.8rem', marginLeft: 'auto' }}>{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p style={{ color: text, margin: 0, lineHeight: 1.6 }}>{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
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
