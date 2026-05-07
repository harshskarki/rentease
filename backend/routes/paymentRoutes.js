const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.post('/order',   protect, (req, res) => res.json({ success: true, message: 'Create payment order - coming in Phase 5' }));
router.post('/verify',  protect, (req, res) => res.json({ success: true, message: 'Verify payment - coming in Phase 5' }));

module.exports = router;
