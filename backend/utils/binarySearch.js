// Binary Search to find the leftmost index where price >= target
const lowerBound = (items, target) => {
  let left = 0;
  let right = items.length - 1;
  let result = items.length;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (items[mid].pricePerDay >= target) {
      result = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return result;
};

// Binary Search to find the rightmost index where price <= target
const upperBound = (items, target) => {
  let left = 0;
  let right = items.length - 1;
  let result = -1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (items[mid].pricePerDay <= target) {
      result = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return result;
};

// Filter items by price range using Binary Search - O(log n)
const filterByPriceRange = (items, minPrice, maxPrice) => {
  // Items must be sorted by price first
  const sorted = [...items].sort((a, b) => a.pricePerDay - b.pricePerDay);
  const left = lowerBound(sorted, minPrice);
  const right = upperBound(sorted, maxPrice);
  if (left > right) return [];
  return sorted.slice(left, right + 1);
};

module.exports = { filterByPriceRange };
