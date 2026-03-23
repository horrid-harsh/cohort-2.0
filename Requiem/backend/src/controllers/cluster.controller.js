import { SaveModel } from "../models/save.model.js";
import { TagModel } from "../models/tag.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { dbscanClustering } from "../services/clustering.service.js";
import { Mistral } from "@mistralai/mistralai";

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

// Ask Mistral to name a cluster based on its saves
const nameCluster = async (saves) => {
  try {
    const titles = saves
      .map((s) => s.title || s.url)
      .slice(0, 8)
      .join("\n");

    const response = await mistral.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "user",
          content: `These are titles of related saved articles/videos:
${titles}

Give this group a short topic name (2-4 words max, lowercase).
Return ONLY the topic name, nothing else.
Example: "machine learning", "web development", "productivity tools"`,
        },
      ],
    });

    return response.choices[0].message.content.trim().toLowerCase();
  } catch {
    return "uncategorized";
  }
};

// GET /api/v1/clusters
export const getClusters = asyncHandler(async (req, res) => {
  // Fetch all saves with embeddings
  const saves = await SaveModel.find({
    user: req.user._id,
    isArchived: false,
    embedding: { $exists: true, $not: { $size: 0 } },
  })
    .select("+embedding title url type thumbnail siteName tags")
    .populate("tags", "name color")
    .lean();

  if (saves.length < 4) {
    return res.status(200).json(
      new ApiResponse(200, [], "Not enough saves to cluster (need at least 4)")
    );
  }

  const items = saves.map((s) => ({
    id: s._id.toString(),
    embedding: s.embedding,
  }));

  const result = dbscanClustering(items, {
    minPts: 2,
  });

  // 🔥 Map for fast lookup
  const saveMap = new Map(
    saves.map((s) => [s._id.toString(), s])
  )

  const MAX_NAMING = 6;

  // Build cluster objects with save details
  const clusters = await Promise.all(
    result.clusters.slice(0, MAX_NAMING).map(async (ids) => {
      if (!ids.length) return null;

      const clusterSaves = ids.map((id) => saveMap.get(id));

      const name = await nameCluster(clusterSaves);

      return {
        name,
        saves: clusterSaves.map((s) => ({
          _id: s._id,
          title: s.title || s.url,
          url: s.url,
          type: s.type,
          thumbnail: s.thumbnail,
          siteName: s.siteName,
          tags: s.tags,
        })),
        count: clusterSaves.length,
      };
    })
  );

  const validClusters = clusters.filter(Boolean);

  if (result.noise.length) {
  const noiseSaves = result.noise.map((id) => saveMap.get(id));

  validClusters.push({
    name: "various topics",
    saves: noiseSaves.map((s) => ({
      _id: s._id,
      title: s.title || s.url,
      url: s.url,
      type: s.type,
      thumbnail: s.thumbnail,
      siteName: s.siteName,
      tags: s.tags,
    })),
    count: noiseSaves.length,
  });
}

  // Sort by cluster size descending
  validClusters.sort((a, b) => b.count - a.count);

  return res.status(200).json(
    new ApiResponse(200, validClusters, "Clusters generated")
  );
});