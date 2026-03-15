import { autoTagSave } from "../services/autoTag.service.js";
import { embedSave } from "../services/embedSave.service.js";
import { SaveModel } from "../models/save.model.js";
import { TagModel } from "../models/tag.model.js";
import { CollectionModel } from "../models/collection.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { scrapeUrl } from "../services/scraper.service.js";
import { generateEmbedding, cosineSimilarity } from "../services/embedding.service.js";

// POST /api/v1/saves
export const createSave = asyncHandler(async (req, res) => {
  const { url, note } = req.body;

  if (!url) throw new ApiError(400, "URL is required");

  // Check for duplicate URL for this user
  const existing = await SaveModel.findOne({ url, user: req.user._id });
  if (existing) throw new ApiError(409, "You've already saved this URL");

  const metadata = await scrapeUrl(url);

  const save = await SaveModel.create({
    user: req.user._id,
    url,
    note: note || "",
    ...metadata,
  });

  autoTagSave(save, req.user._id);
  embedSave(save._id, req.user._id);

  return res.status(201).json(new ApiResponse(201, save, "Saved successfully"));
});

// GET /api/v1/saves
export const getAllSaves = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    type,
    isFavorite,
    isArchived = false,
    search,
    semantic,
  } = req.query;

  // ─── SEMANTIC SEARCH PATH ─────────────────────────────────────────────
  if (search && semantic === "true") {
    if (search.trim().length < 3) {
    return res.status(200).json(new ApiResponse(200, { saves: [], pagination: null }, "Query too short"));
  }
    const queryEmbedding = await generateEmbedding(search);

    if (!queryEmbedding) {
      return res.status(200).json(new ApiResponse(200, { saves: [], pagination: null }, "No results"));
    }

    const allSaves = await SaveModel.find({
      user: req.user._id,
      isArchived: false,           
      embedding: { $exists: true, $not: { $size: 0 } },
    })
      .select("+embedding")
      .populate("tags", "name color")
      .populate("collections", "name emoji color")
      .lean();

    const scored = allSaves
      .map((save) => ({
        ...save,
        score: cosineSimilarity(queryEmbedding, save.embedding),
        embedding: undefined, // strip before sending to frontend
      }))
      .filter((save) => save.score > 0.65)
      .sort((a, b) => b.score - a.score)
      .slice(0, Number(limit));

    return res.status(200).json(
      new ApiResponse(200, {
        saves: scored,
        pagination: {
          total: scored.length,
          page: 1,
          limit: Number(limit),
          totalPages: 1,
        },
      }, "Semantic search results")
    );
  }

  // ─── NORMAL PATH (your existing code, untouched) ──────────────────────
  const filter = {
    user: req.user._id,
    isArchived: isArchived === "true",
  };

  if (req.query.tag) filter.tags = req.query.tag;
  if (type) filter.type = type;
  if (isFavorite) filter.isFavorite = isFavorite === "true";

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { note: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [saves, total] = await Promise.all([
    SaveModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("tags", "name color")
      .populate("collections", "name emoji color"),
    SaveModel.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      saves,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    }, "Saves fetched successfully")
  );
});


// GET /api/v1/saves/:id
export const getSaveById = asyncHandler(async (req, res) => {
  const save = await SaveModel.findOne({
    _id: req.params.id,
    user: req.user._id, // ensures user can only access their own saves
  })
    .populate("tags", "name color")
    .populate("collections", "name emoji color");

  if (!save) throw new ApiError(404, "Save not found");

  return res
    .status(200)
    .json(new ApiResponse(200, save, "Save fetched successfully"));
});

// PATCH /api/v1/saves/:id
export const updateSave = asyncHandler(async (req, res) => {
  const allowedUpdates = [
    "title", "note", "isFavorite", "isArchived", "type", "highlights"
  ];

  // Only pick allowed fields from body
  const updates = {};
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No valid fields to update");
  }

  const save = await SaveModel.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: updates },
    { returnDocument: "after", runValidators: true }
  );

  if (!save) throw new ApiError(404, "Save not found");

  return res
    .status(200)
    .json(new ApiResponse(200, save, "Save updated successfully"));
});

// DELETE /api/v1/saves/:id
export const deleteSave = asyncHandler(async (req, res) => {
  const save = await SaveModel.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!save) throw new ApiError(404, "Save not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Save deleted successfully"));
});
