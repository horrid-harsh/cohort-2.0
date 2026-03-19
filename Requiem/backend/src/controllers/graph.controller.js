import { SaveModel } from "../models/save.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET /api/v1/graph
export const getGraph = asyncHandler(async (req, res) => {
  // Fetch all non-archived saves with tags populated
  const saves = await SaveModel.find({
    user: req.user._id,
    isArchived: false,
  })
    .populate("tags", "name color")
    .select("title url thumbnail siteName type tags favicon")
    .lean();

  if (!saves.length) {
    return res.status(200).json(
      new ApiResponse(200, { nodes: [], links: [] }, "Graph data")
    );
  }

  // Build nodes — one per save
  const nodes = saves.map((save) => ({
    id: save._id.toString(),
    title: save.title || save.url,
    url: save.url,
    thumbnail: save.thumbnail,
    favicon: save.favicon,
    siteName: save.siteName,
    type: save.type,
    tags: save.tags.map((t) => ({ id: t._id.toString(), name: t.name, color: t.color })),
  }));

  // Build links — connect saves that share at least one tag
  const links = [];
  const seen = new Set();

  for (let i = 0; i < saves.length; i++) {
    for (let j = i + 1; j < saves.length; j++) {
      const tagsA = saves[i].tags.map((t) => t._id.toString());
      const tagsB = saves[j].tags.map((t) => t._id.toString());

      // Find shared tags
      const shared = tagsA.filter((t) => tagsB.includes(t));

      if (shared.length > 0) {
        const linkKey = `${saves[i]._id}-${saves[j]._id}`;
        if (!seen.has(linkKey)) {
          seen.add(linkKey);
          links.push({
            source: saves[i]._id.toString(),
            target: saves[j]._id.toString(),
            sharedTags: shared.length, // stronger connection = more shared tags
          });
        }
      }
    }
  }

  return res.status(200).json(
    new ApiResponse(200, { nodes, links }, "Graph data fetched")
  );
});