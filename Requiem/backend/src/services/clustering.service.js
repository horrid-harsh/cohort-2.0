import { cosineSimilarity } from "./embedding.service.js";

// ---------- Utils ----------

// Normalize vector (important for cosine-based clustering)
const normalize = (vec) => {
  const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
  return norm === 0 ? vec : vec.map(v => v / norm);
};

const cosineDistance = (a, b) => 1 - cosineSimilarity(a, b);

const averageVector = (vectors) => {
  const dim = vectors[0].length;
  const avg = new Array(dim).fill(0);

  for (const vec of vectors) {
    for (let i = 0; i < dim; i++) avg[i] += vec[i];
  }

  return avg.map(v => v / vectors.length);
};

// ---------- K-Means Core ----------

const runKMeans = (items, k, maxIterations = 30) => {
  // Normalize all embeddings once
  const normalizedItems = items.map(item => ({
    ...item,
    embedding: normalize(item.embedding)
  }));

  // ---- K-Means++ Initialization ----
  const centroids = [];
  const firstIdx = Math.floor(Math.random() * normalizedItems.length);
  centroids.push([...normalizedItems[firstIdx].embedding]);

  for (let ci = 1; ci < k; ci++) {
    const distances = normalizedItems.map(item => {
      const minDist = Math.min(
        ...centroids.map(c => cosineDistance(item.embedding, c))
      );
      return minDist ** 2;
    });

    const total = distances.reduce((a, b) => a + b, 0);
    let rand = Math.random() * total;

    let chosen = 0;
    for (let i = 0; i < distances.length; i++) {
      rand -= distances[i];
      if (rand <= 0) {
        chosen = i;
        break;
      }
    }

    centroids.push([...normalizedItems[chosen].embedding]);
  }

  let assignments = new Array(normalizedItems.length).fill(0);

  // ---- Main Loop ----
  for (let iter = 0; iter < maxIterations; iter++) {
    let changed = false;

    // Assign step
    const newAssignments = normalizedItems.map((item, idx) => {
      let minDist = Infinity;
      let nearest = 0;

      for (let i = 0; i < k; i++) {
        const dist = cosineDistance(item.embedding, centroids[i]);
        if (dist < minDist) {
          minDist = dist;
          nearest = i;
        }
      }

      if (nearest !== assignments[idx]) changed = true;
      return nearest;
    });

    assignments = newAssignments;
    if (!changed) break;

    // Group vectors (O(n))
    const grouped = Array.from({ length: k }, () => []);
    assignments.forEach((ci, i) => {
      grouped[ci].push(normalizedItems[i].embedding);
    });

    // Update centroids
    for (let ci = 0; ci < k; ci++) {
      if (grouped[ci].length === 0) {
        // Reinitialize empty cluster
        const randIdx = Math.floor(Math.random() * normalizedItems.length);
        centroids[ci] = [...normalizedItems[randIdx].embedding];
      } else {
        const avg = averageVector(grouped[ci]);
        centroids[ci] = normalize(avg); // critical
      }
    }
  }

  // ---- Score (average intra-cluster distance) ----
  const score =
    assignments.reduce((acc, ci, i) => {
      return acc + cosineDistance(normalizedItems[i].embedding, centroids[ci]);
    }, 0) / normalizedItems.length;

  // ---- Build clusters ----
  const clusters = Array.from({ length: k }, () => []);
  assignments.forEach((ci, i) => {
    clusters[ci].push(items[i].id);
  });

  return {
    clusters: clusters.filter(c => c.length > 0),
    score
  };
};

// ---------- Multi-run wrapper ----------

export const kMeansClustering = (items, k, runs = 5) => {
  if (items.length <= k) {
    return items.map(item => [item.id]);
  }

  let best = null;
  let bestScore = Infinity;

  for (let r = 0; r < runs; r++) {
    const result = runKMeans(items, k);

    if (result.score < bestScore) {
      bestScore = result.score;
      best = result.clusters;
    }
  }

  return best;
};