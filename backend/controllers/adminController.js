const User = require('../models/User');
const Item = require('../models/Item');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalItems = await Item.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalReviews = await Review.countDocuments();
    const paidBookings = await Booking.find({ 'payment.status': 'paid' });
    const totalRevenue = paidBookings.reduce((acc, b) => acc + b.totalAmount, 0);

    res.json({
      success: true,
      stats: { totalUsers, totalItems, totalBookings, totalReviews, totalRevenue },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await Item.deleteMany({ owner: req.params.id });
    await Booking.deleteMany({ $or: [{ renter: req.params.id }, { owner: req.params.id }] });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllItemsAdmin = async (req, res) => {
  try {
    const items = await Item.find().populate('owner', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteItemAdmin = async (req, res) => {
  try {
    await Booking.deleteMany({ item: req.params.id });
    await Item.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllBookingsAdmin = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('item renter owner').sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const makeFirstAdmin = async (req, res) => {
  try {
    const { secretKey, email } = req.body;
    if (secretKey !== process.env.JWT_SECRET) {
      return res.status(403).json({ success: false, message: 'Invalid secret key' });
    }
    const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: `${user.email} is now an admin` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getStats, getAllUsers, deleteUser, getAllItemsAdmin, deleteItemAdmin, getAllBookingsAdmin, makeFirstAdmin };

