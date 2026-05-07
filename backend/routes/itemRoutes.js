const express = require('express');
const router = express.Router();
const { getAllItems, getItemById, createItem, updateItem, deleteItem, getMyItems } = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllItems);
router.get('/my-items', protect, getMyItems);
router.get('/:id', getItemById);
router.post('/', protect, createItem);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;
