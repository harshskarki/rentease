const Review = require('../models/Review');
const Item = require('../models/Item');
const Booking = require('../models/Booking');

const createReview = async (req, res) => {
  try {
    const { itemId, bookingId, rating, comment } = req.body;

    // Check booking exists and is completed
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.renter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the renter can review' });
    }
    if (booking.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'You can only review completed bookings' });
    }

    // Check if already reviewed
    const existing = await Review.findOne({ booking: bookingId });
    if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this booking' });

    const review = await Review.create({
      item: itemId,
      user: req.user._id,
      booking: bookingId,
      rating,
      comment,
    });

    // Update item rating
    const reviews = await Review.find({ item: itemId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await Item.findByIdAndUpdate(itemId, { rating: avgRating.toFixed(1), numReviews: reviews.length });

    await review.populate('user', 'name avatar');
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getItemReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ item: req.params.itemId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createReview, getItemReviews };
