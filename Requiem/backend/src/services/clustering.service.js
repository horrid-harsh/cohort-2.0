import clustering from "density-clustering";
import { cosineSimilarity } from "./embedding.service.js";

const { DBSCAN } = clustering;

// ---------- Utils ----------

const normalize = (vec) => {
  const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
  return norm === 0 ? vec : vec.map((v) => v / norm);
};

const cosineDistance = (a, b) => 1 - cosineSimilarity(a, b);

// ---------- Dynamic EPS ----------

const computeNearestNeighborDistances = (items) => {
  const distances = [];

  for (let i = 0; i < items.length; i++) {
    let minDist = Infinity;

    for (let j = 0; j < items.length; j++) {
      if (i === j) continue;

      const dist = cosineDistance(
        items[i].embedding,
        items[j].embedding
      );

      if (dist < minDist) minDist = dist;
    }

    distances.push(minDist);
  }

  return distances;
};

const calculateDynamicEps = (items) => {
  const distances = computeNearestNeighborDistances(items);
  distances.sort((a, b) => a - b);

  const idx = Math.floor(distances.length * 0.75);
  return distances[idx];
};

// ---------- DBSCAN Clustering ----------

export const dbscanClustering = (items, options = {}) => {
  const { minPts = 2 } = options;

  if (!items || items.length === 0) {
    return { clusters: [], noise: [] };
  }

  if (items.length < minPts) {
    return {
      clusters: [],
      noise: items.map((i) => i.id),
    };
  }

  // Normalize embeddings
  const normalizedItems = items.map((item) => ({
    ...item,
    embedding: normalize(item.embedding),
  }));

  // 🔥 Compute dynamic eps
  const eps = calculateDynamicEps(normalizedItems);
  const dbscan = new DBSCAN();

  const distance = (a, b) => cosineDistance(a.embedding, b.embedding);

  const rawClusters = dbscan.run(
    normalizedItems,
    eps,
    minPts,
    distance
  );

  const noiseIdx = dbscan.noise;

  const clusters = rawClusters.map((cluster) =>
    cluster.map((idx) => normalizedItems[idx].id)
  );

  const noise = noiseIdx.map((idx) => normalizedItems[idx].id);

  return {
    clusters,
    noise,
  };
};