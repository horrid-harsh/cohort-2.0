import { autoTagSave } from "../services/autoTag.service.js";
import { embedSave } from "../services/embedSave.service.js";
import { SaveModel } from "../models/save.model.js";
import { TagModel } from "../models/tag.model.js";
import { CollectionModel } from "../models/collection.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { scrapeUrl } from "../services/scraper.service.js";
import {
  generateEmbedding,
  cosineSimilarity,
} from "../services/embedding.service.js";
import { deleteFile } from "../services/storage.service.js";
import { addSaveJob } from "../jobs/save.queue.js";

// POST /api/v1/saves
export const createSave = asyncHandler(async (req, res) => {
  const { url, note, ...bodyMetadata } = req.body;
  if (!url) throw new ApiError(400, "URL is required");

  // Check for duplicate URL for this user
  const existing = await SaveModel.findOne({ url, user: req.user._id });
  if (existing) throw new ApiError(409, "You've already saved this URL");

  let metadata = {};
  // Skip scraper if metadata (like title) is already provided (e.g., from direct upload)
  if (!bodyMetadata.title) {
    metadata = await scrapeUrl(url);
  }

  // 2. Create save with metadata (status: pending or completed)
  const save = await SaveModel.create({
    user: req.user._id,
    url,
    note: note || "",
    ...metadata,
    ...bodyMetadata,
    processingStatus: bodyMetadata.processingStatus || "pending",
  });

  // 3. Offload heavy tasks to BullMQ (only for generic URLs or if requested)
  if (save.processingStatus === "pending") {
    try {
      await addSaveJob({ saveId: save._id, userId: req.user._id });
    } catch (err) {
      console.error("Queue failed:", err.message);
      await SaveModel.findByIdAndUpdate(save._id, { processingStatus: "failed" });
    }
  }

  return res.status(201).json(
    new ApiResponse(201, save, "Save initiated.")
  );
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
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { saves: [], pagination: null },
            "Query too short",
          ),
        );
    }
    const queryEmbedding = await generateEmbedding(search);

    if (!queryEmbedding) {
      return res
        .status(200)
        .json(
          new ApiResponse(200, { saves: [], pagination: null }, "No results"),
        );
    }

    const allSaves = await SaveModel.find({
      user: req.user._id,
      isArchived: false,
    })
      .select("+embedding title url description note tags thumbnail type siteName favicon")
      .populate("tags", "name color")
      .populate("collections", "name emoji color")
      .lean();

    const searchTerm = search.toLowerCase().trim();

    const scored = allSaves
      .map((save) => {
        // 1. Calculate AI Score (if embedding exists)
        let aiScore = 0;
        if (save.embedding && Array.isArray(save.embedding)) {
          aiScore = cosineSimilarity(queryEmbedding, save.embedding);
        }
        
        // 2. Exact Title/URL Match (Highest Priority)
        const isTitleMatch = (save.title || "").toLowerCase().includes(searchTerm);
        const isUrlMatch = (save.url || "").toLowerCase().includes(searchTerm);
        
        // 3. Tag Match (High Priority)
        const isTagMatch = save.tags?.some(tag => (tag.name || "").toLowerCase().includes(searchTerm));
        
        // 4. Description/Note Match (Medium Priority)
        const isDescMatch = (save.description || "").toLowerCase().includes(searchTerm);
        const isNoteMatch = (save.note || "").toLowerCase().includes(searchTerm);
        
        // Combine scores with priorities
        let finalScore = aiScore;
        if (isTitleMatch || isUrlMatch) finalScore = Math.max(finalScore, 1.0);
        else if (isTagMatch) finalScore = Math.max(finalScore, 0.9);
        else if (isDescMatch || isNoteMatch) finalScore = Math.max(finalScore, 0.8);

        return {
          ...save,
          score: finalScore,
          embedding: undefined,
        };
      })
      // Any reasonable similarity (0.4) OR any text match (>= 0.8) passes
      .filter((save) => save.score > 0.4) 
      .sort((a, b) => b.score - a.score)
      .slice(0, Number(limit));

    // Return the response... (rest of the block)

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          saves: scored,
          pagination: {
            total: scored.length,
            page: 1,
            limit: Number(limit),
            totalPages: 1,
          },
        },
        "Semantic search results",
      ),
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

  if (search && search.trim() !== "") {
    filter.$or = [
      { title: { $regex: search.trim(), $options: "i" } },
      { url: { $regex: search.trim(), $options: "i" } },
      { description: { $regex: search.trim(), $options: "i" } },
      { note: { $regex: search.trim(), $options: "i" } },
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
    new ApiResponse(
      200,
      {
        saves,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
      "Saves fetched successfully",
    ),
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

// GET /api/v1/saves/:id/related
export const getRelatedSaves = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const SIMILARITY_THRESHOLD = 0.75;
  const MAX_CANDIDATES = 100;
  const MAX_RESULTS = 5;

  // Get current save
  const currentSave = await SaveModel.findOne({
    _id: id,
    user: req.user._id,
  }).select("+embedding");

  if (!currentSave) {
    throw new ApiError(404, "Save not found");
  }

  if (!currentSave.embedding?.length) {
    return res.status(200).json(
      new ApiResponse(200, [], "No embedding available yet")
    );
  }

  // Fetch candidate saves (limited + sorted)
  const candidates = await SaveModel.find({
    user: req.user._id,
    _id: { $ne: id },
    isArchived: false,
    embedding: { $exists: true, $ne: [] }, // FIXED query
  })
    .select("+embedding")
    .populate("tags", "name color")
    .sort({ createdAt: -1 }) // better candidate selection
    .limit(MAX_CANDIDATES)   // performance guard
    .lean();

  // Validate embeddings
  const isValidEmbedding = (a, b) =>
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length > 0 &&
    a.length === b.length;

  const currentEmbedding = currentSave.embedding;

  // Cosine (assumes normalized embeddings)
  const cosineSimilarity = (a, b) => {
    let dot = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
    }
    return dot;
  };

  // Score + filter + sort
  const results = [];

  for (const save of candidates) {
    if (!isValidEmbedding(currentEmbedding, save.embedding)) continue;

    const score = cosineSimilarity(currentEmbedding, save.embedding);

    if (score >= SIMILARITY_THRESHOLD) {
      results.push({
        ...save,
        score,
        embedding: undefined, // strip heavy data
      });
    }
  }

  results.sort((a, b) => b.score - a.score);

  return res.status(200).json(
    new ApiResponse(
      200,
      results.slice(0, MAX_RESULTS),
      "Related saves fetched"
    )
  );
});

// GET /api/v1/saves/resurface
// Returns 1 random save that hasn't been seen in 30+ days
export const getSaveToResurface = asyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Find saves not surfaced in 30+ days (or never surfaced)
  const candidates = await SaveModel.find({
    user: req.user._id,
    isArchived: false,
    $or: [
      { lastSurfacedAt: null },
      { lastSurfacedAt: { $lt: thirtyDaysAgo } },
    ],
    // Only resurface saves older than 30 days
    createdAt: { $lt: thirtyDaysAgo },
  })
    .select("title url thumbnail siteName type tags createdAt lastSurfacedAt")
    .populate("tags", "name color")
    .lean();

  if (!candidates.length) {
    return res.status(200).json(
      new ApiResponse(200, null, "No saves to resurface")
    );
  }

  // Pick a random one from candidates
  const random = candidates[Math.floor(Math.random() * candidates.length)];

  // Update lastSurfacedAt so it won't resurface again for 30 days
  await SaveModel.findByIdAndUpdate(random._id, {
    lastSurfacedAt: new Date(),
    $inc: { surfaceCount: 1 },
  });

  return res.status(200).json(
    new ApiResponse(200, random, "Save resurfaced")
  );
});

// PATCH /api/v1/saves/:id
export const updateSave = asyncHandler(async (req, res) => {
  const allowedUpdates = [
    "title",
    "note",
    "isFavorite",
    "isArchived",
    "type",
    "highlights",
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
    { returnDocument: "after", runValidators: true },
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

  // If this was a local file upload to Supabase, delete from storage too
  if (save.url && save.url.includes("/uploads/")) {
    try {
      await deleteFile(save.url);
    } catch (err) {
      console.error("Cleanup failed for deleted save:", save.url, err.message);
      // We don't throw here to ensure the user at least sees the DB entry gone
    }
  }

  return res.status(200).json(new ApiResponse(200, {}, "Save deleted successfully"));
});
