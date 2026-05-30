const User = require('../models/User');
const Item = require('../models/Item');
const Booking = require('../models/Booking');
const { cloudinary, upload } = require('../config/cloudinary');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const totalItems = await Item.countDocuments({ owner: req.user._id });
    const totalBookings = await Booking.countDocuments({ renter: req.user._id });
    res.json({ success: true, user, stats: { totalItems, totalBookings } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const items = await Item.find({ owner: req.params.id });
    const totalBookings = await Booking.countDocuments({ renter: req.params.id });
    res.json({ success: true, user, items, stats: { totalItems: items.length, totalBookings } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, city, bio } = req.body;
    let avatar = req.user.avatar;
    if (req.file) {
      avatar = req.file.path;
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, city, bio, avatar },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    await Item.deleteMany({ owner: req.user._id });
    await Booking.deleteMany({ renter: req.user._id });
    await User.findByIdAndDelete(req.user._id);
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getProfile, getPublicProfile, updateProfile, changePassword, deleteAccount };
