const Item = require('../models/Item');
const { buildTrie, searchTrie } = require('../utils/trie');

let trieBuilt = false;

const rebuildTrie = async () => {
  const items = await Item.find({ isAvailable: true });
  buildTrie(items);
  trieBuilt = true;
};

const autocomplete = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 1) return res.json({ success: true, suggestions: [] });
    if (!trieBuilt) await rebuildTrie();
    const suggestions = searchTrie(q);
    res.json({ success: true, suggestions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const refreshTrie = async (req, res) => {
  try {
    await rebuildTrie();
    res.json({ success: true, message: 'Trie rebuilt successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { autocomplete, refreshTrie };
