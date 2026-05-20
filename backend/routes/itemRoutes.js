const express = require('express');
const router = express.Router();
const { getAllItems, getItemById, createItem, updateItem, deleteItem, getMyItems } = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getAllItems);
router.get('/my-items', protect, getMyItems);
router.get('/:id', getItemById);
router.post('/', protect, upload.array('images', 5), createItem);
router.put('/:id', protect, upload.array('images', 5), updateItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;
