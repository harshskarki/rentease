class MaxHeap {
  constructor() {
    this.heap = [];
  }

  getParent(i) { return Math.floor((i - 1) / 2); }
  getLeft(i) { return 2 * i + 1; }
  getRight(i) { return 2 * i + 2; }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  insert(item) {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  bubbleUp(i) {
    while (i > 0) {
      const parent = this.getParent(i);
      if (this.heap[parent].score >= this.heap[i].score) break;
      this.swap(parent, i);
      i = parent;
    }
  }

  extractMax() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    const max = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);
    return max;
  }

  bubbleDown(i) {
    const n = this.heap.length;
    while (true) {
      let largest = i;
      const left = this.getLeft(i);
      const right = this.getRight(i);
      if (left < n && this.heap[left].score > this.heap[largest].score) largest = left;
      if (right < n && this.heap[right].score > this.heap[largest].score) largest = right;
      if (largest === i) break;
      this.swap(i, largest);
      i = largest;
    }
  }

  getTopK(k) {
    const result = [];
    const temp = new MaxHeap();
    temp.heap = [...this.heap];
    for (let i = 0; i < k && temp.heap.length > 0; i++) {
      result.push(temp.extractMax());
    }
    return result;
  }

  size() { return this.heap.length; }
}

// Build priority queue from items based on popularity score
const buildRecommendations = (items) => {
  const heap = new MaxHeap();
  items.forEach(item => {
    const score = (item.numReviews * 3) + (item.rating * 2) + (item.bookedDates?.length || 0);
    heap.insert({
      id: item._id.toString(),
      title: item.title,
      category: item.category,
      city: item.location.city,
      pricePerDay: item.pricePerDay,
      image: item.images?.[0] || '',
      rating: item.rating,
      score,
    });
  });
  return heap;
};

module.exports = { MaxHeap, buildRecommendations };
