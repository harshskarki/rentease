const Booking = require('../models/Booking');
const Item = require('../models/Item');
const User = require('../models/User');
const { sendBookingConfirmationToOwner, sendBookingStatusToRenter } = require('../utils/emailService');

const checkDateConflict = async (itemId, startDate, endDate, excludeBookingId = null) => {
  const query = {
    item: itemId,
    status: { $in: ['pending', 'confirmed', 'active'] },
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
    ],
  };
  if (excludeBookingId) query._id = { $ne: excludeBookingId };
  const conflict = await Booking.findOne(query);
  return conflict;
};

const createBooking = async (req, res) => {
  try {
    const { itemId, startDate, endDate, notes } = req.body;
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    if (!item.isAvailable) return res.status(400).json({ success: false, message: 'Item is not available' });
    if (item.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot rent your own item' });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (totalDays < 1) return res.status(400).json({ success: false, message: 'Invalid dates' });

    // Check for booking conflicts
    const conflict = await checkDateConflict(itemId, start, end);
    if (conflict) {
      return res.status(400).json({
        success: false,
        message: `Item is already booked from ${new Date(conflict.startDate).toLocaleDateString()} to ${new Date(conflict.endDate).toLocaleDateString()}. Please choose different dates.`
      });
    }

    const totalAmount = totalDays * item.pricePerDay;
    const booking = await Booking.create({
      item: itemId,
      renter: req.user._id,
      owner: item.owner,
      startDate: start,
      endDate: end,
      totalDays,
      totalAmount,
      notes,
    });
    await booking.populate(['item', 'renter', 'owner']);
    try {
      const owner = await User.findById(item.owner);
      await sendBookingConfirmationToOwner(
        owner.email, owner.name, req.user.name,
        item.title, start, end, totalAmount
      );
    } catch (emailErr) {
      console.error('Email error:', emailErr.message);
    }
    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ renter: req.user._id }).populate('item owner');
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id }).populate('item renter');
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('item renter owner');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.renter._id.toString() !== req.user._id.toString() &&
        booking.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('item renter');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.owner.toString() !== req.user._id.toString() && booking.renter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    booking.status = status;
    await booking.save();
    try {
      await sendBookingStatusToRenter(
        booking.renter.email, booking.renter.name,
        booking.item.title, status,
        booking.startDate, booking.endDate, booking.totalAmount
      );
    } catch (emailErr) {
      console.error('Email error:', emailErr.message);
    }
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.renter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ success: true, message: 'Booking cancelled', booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getBookedDates = async (req, res) => {
  try {
    const { itemId } = req.params;
    const bookings = await Booking.find({
      item: itemId,
      status: { $in: ['pending', 'confirmed', 'active'] },
    }).select('startDate endDate');
    res.json({ success: true, bookedDates: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createBooking, getMyBookings, getOwnerBookings, getBookingById, updateBookingStatus, cancelBooking, getBookedDates };
