const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Item title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  category: {
    type: String,
    required: true,
    enum: ['bikes', 'gadgets', 'tools', 'furniture', 'sports', 'vehicles', 'other'],
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Price per day is required'],
    min: [1, 'Price must be at least ?1'],
  },
  images: [{ type: String }],
  location: {
    city: { type: String, required: true },
    state: { type: String },
    pincode: { type: String },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isAvailable: { type: Boolean, default: true },
  bookedDates: [{
    startDate: Date,
    endDate: Date,
  }],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

itemSchema.index({ title: 'text', description: 'text', 'location.city': 'text' });

module.exports = mongoose.model('Item', itemSchema);
