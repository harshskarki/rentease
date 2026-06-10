const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getOwnerBookings, getBookingById, updateBookingStatus, cancelBooking, getBookedDates } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/owner-bookings', protect, getOwnerBookings);
router.get('/booked-dates/:itemId', getBookedDates);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
