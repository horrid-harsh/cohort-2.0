import { CollectionModel } from "../models/collection.model.js";
import { SaveModel } from "../models/save.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// POST /api/v1/collections
export const createCollection = asyncHandler(async (req, res) => {
  const { name, description, emoji, color } = req.body;

  if (!name) throw new ApiError(400, "Collection name is required");

  const existing = await CollectionModel.findOne({
    user: req.user._id,
    name: name.trim(),
  });
  if (existing) throw new ApiError(409, "Collection with this name already exists");

  const collection = await CollectionModel.create({
    user: req.user._id,
    name,
    description: description || "",
    emoji: emoji || "📁",
    color: color || "#6366f1",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, collection, "Collection created successfully"));
});

// GET /api/v1/collections
export const getAllCollections = asyncHandler(async (req, res) => {
  const collections = await CollectionModel.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  // Attach save count to each collection
  const collectionsWithCount = await Promise.all(
    collections.map(async (col) => {
      const count = await SaveModel.countDocuments({
        user: req.user._id,
        collections: col._id,
        isArchived: false,
      });
      return { ...col.toObject(), saveCount: count };
    })
  );

  return res
    .status(200)
    .json(new ApiResponse(200, collectionsWithCount, "Collections fetched successfully"));
});

// GET /api/v1/collections/:id
export const getCollectionById = asyncHandler(async (req, res) => {
  const collection = await CollectionModel.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!collection) throw new ApiError(404, "Collection not found");

  // Get all saves inside this collection
  const saves = await SaveModel.find({
    user: req.user._id,
    collections: collection._id,
    isArchived: false,
  })
    .sort({ createdAt: -1 })
    .populate("tags", "name color");

  return res
    .status(200)
    .json(new ApiResponse(200, { collection, saves }, "Collection fetched successfully"));
});

// PATCH /api/v1/collections/:id
export const updateCollection = asyncHandler(async (req, res) => {
  const allowedUpdates = ["name", "description", "emoji", "color", "isPublic"];

  const updates = {};
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No valid fields to update");
  }

  const collection = await CollectionModel.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: updates },
    { returnDocument: "after", runValidators: true }
  );

  if (!collection) throw new ApiError(404, "Collection not found");

  return res
    .status(200)
    .json(new ApiResponse(200, collection, "Collection updated successfully"));
});

// DELETE /api/v1/collections/:id
export const deleteCollection = asyncHandler(async (req, res) => {
  const collection = await CollectionModel.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!collection) throw new ApiError(404, "Collection not found");

  // Remove this collection reference from all saves
  await SaveModel.updateMany(
    { user: req.user._id, collections: collection._id },
    { $pull: { collections: collection._id } }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Collection deleted successfully"));
});

// PATCH /api/v1/collections/:id/saves/:saveId  → add save to collection
export const addSaveToCollection = asyncHandler(async (req, res) => {
  const { id: collectionId, saveId } = req.params;

  const collection = await CollectionModel.findOne({
    _id: collectionId,
    user: req.user._id,
  });
  if (!collection) throw new ApiError(404, "Collection not found");

  const save = await SaveModel.findOneAndUpdate(
    { _id: saveId, user: req.user._id },
    { $addToSet: { collections: collectionId } }, // addToSet = no duplicates
    { returnDocument: "after" }
  );
  if (!save) throw new ApiError(404, "Save not found");

  return res
    .status(200)
    .json(new ApiResponse(200, save, "Save added to collection"));
});

// DELETE /api/v1/collections/:id/saves/:saveId  → remove save from collection
export const removeSaveFromCollection = asyncHandler(async (req, res) => {
  const { id: collectionId, saveId } = req.params;

  const save = await SaveModel.findOneAndUpdate(
    { _id: saveId, user: req.user._id },
    { $pull: { collections: collectionId } },
    { new: true }
  );
  if (!save) throw new ApiError(404, "Save not found");

  return res
    .status(200)
    .json(new ApiResponse(200, save, "Save removed from collection"));
});