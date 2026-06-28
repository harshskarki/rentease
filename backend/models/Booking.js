const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  renter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalDays: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending',
  },
  payment: {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    status: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
    paidAt: Date,
  },
  notes: { type: String, maxlength: 500 },
  lateFee: { type: Number, default: 0 },
  isLate: { type: Boolean, default: false },
  extensionRequest: {
    newEndDate: Date,
    status: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
    requestedAt: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
