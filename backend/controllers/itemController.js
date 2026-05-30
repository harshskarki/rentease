const Item = require('../models/Item');

const getAllItems = async (req, res) => {
  try {
    const { category, city, minPrice, maxPrice, search, page = 1, limit = 6 } = req.query;
    let query = {};
    if (category) query.category = category;
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }
    if (search) query.$text = { $search: search };

    const total = await Item.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const items = await Item.find(query)
      .populate('owner', 'name email phone avatar')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, count: items.length, total, totalPages, currentPage: Number(page), items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('owner', 'name email phone avatar');
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createItem = async (req, res) => {
  try {
    const images = req.files ? req.files.map(file => file.path) : [];
    const location = typeof req.body.location === 'string'
      ? JSON.parse(req.body.location)
      : req.body.location;
    const item = await Item.create({
      ...req.body,
      location,
      images,
      owner: req.user._id,
    });
    res.status(201).json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const images = req.files && req.files.length > 0
      ? req.files.map(file => file.path)
      : item.images;
    const location = req.body.location
      ? (typeof req.body.location === 'string' ? JSON.parse(req.body.location) : req.body.location)
      : item.location;
    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      { ...req.body, location, images },
      { new: true, runValidators: true }
    );
    res.json({ success: true, item: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await item.deleteOne();
    res.json({ success: true, message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user._id });
    res.json({ success: true, count: items.length, items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllItems, getItemById, createItem, updateItem, deleteItem, getMyItems };
