const express = require('express');
const router = express.Router();
const { getStats, getAllUsers, deleteUser, getAllItemsAdmin, deleteItemAdmin, getAllBookingsAdmin, makeFirstAdmin } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

router.post('/make-first-admin', makeFirstAdmin);

router.use(protect, isAdmin);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/items', getAllItemsAdmin);
router.delete('/items/:id', deleteItemAdmin);
router.get('/bookings', getAllBookingsAdmin);

module.exports = router;
