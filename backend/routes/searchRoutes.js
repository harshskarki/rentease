const express = require('express');
const router = express.Router();
const { autocomplete, refreshTrie } = require('../controllers/searchController');

router.get('/autocomplete', autocomplete);
router.post('/refresh', refreshTrie);

module.exports = router;
