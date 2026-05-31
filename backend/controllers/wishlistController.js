const User = require('../models/User');

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.user._id);
    const isWishlisted = user.wishlist.includes(itemId);
    if (isWishlisted) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== itemId);
    } else {
      user.wishlist.push(itemId);
    }
    await user.save();
    res.json({ success: true, wishlisted: !isWishlisted, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getWishlist, toggleWishlist };
