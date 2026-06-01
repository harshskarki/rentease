const Item = require('../models/Item');
const { buildRecommendations } = require('../utils/priorityQueue');

const getRecommendations = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 6;
    const items = await Item.find({ isAvailable: true });
    const heap = buildRecommendations(items);
    const topItems = heap.getTopK(limit);
    res.json({ success: true, recommendations: topItems });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getRecommendations };
