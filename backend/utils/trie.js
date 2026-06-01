class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
    this.items = [];
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word, itemData) {
    let node = this.root;
    const lowerWord = word.toLowerCase();
    for (const char of lowerWord) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
      if (!node.items.find(i => i.id === itemData.id)) {
        node.items.push(itemData);
      }
    }
    node.isEnd = true;
  }

  search(prefix) {
    let node = this.root;
    const lowerPrefix = prefix.toLowerCase();
    for (const char of lowerPrefix) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }
    return node.items.slice(0, 8);
  }

  clear() {
    this.root = new TrieNode();
  }
}

const trie = new Trie();

const buildTrie = (items) => {
  trie.clear();
  items.forEach(item => {
    const itemData = {
      id: item._id.toString(),
      title: item.title,
      category: item.category,
      city: item.location.city,
      pricePerDay: item.pricePerDay,
      image: item.images[0] || '',
    };
    trie.insert(item.title, itemData);
    trie.insert(item.location.city, itemData);
    trie.insert(item.category, itemData);
  });
};

const searchTrie = (prefix) => {
  return trie.search(prefix);
};

module.exports = { buildTrie, searchTrie };
