import { TagModel } from "../models/tag.model.js";
import { SaveModel } from "../models/save.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// POST /api/v1/tags
export const createTag = asyncHandler(async (req, res) => {
  const { name, color } = req.body;

  if (!name) throw new ApiError(400, "Tag name is required");

  // Tag model already has unique index on user+name
  const tag = await TagModel.create({
    user: req.user._id,
    name: name.trim().toLowerCase(),
    color: color || "#6366f1",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, tag, "Tag created successfully"));
});

// GET /api/v1/tags
export const getAllTags = asyncHandler(async (req, res) => {
  const tags = await TagModel.find({ user: req.user._id }).sort({ name: 1 });

  // Attach save count to each tag
  const tagsWithCount = await Promise.all(
    tags.map(async (tag) => {
      const count = await SaveModel.countDocuments({
        user: req.user._id,
        tags: tag._id,
        isArchived: false,
      });
      return { ...tag.toObject(), saveCount: count };
    })
  );

  return res
    .status(200)
    .json(new ApiResponse(200, tagsWithCount, "Tags fetched successfully"));
});

// PATCH /api/v1/tags/:id
export const updateTag = asyncHandler(async (req, res) => {
  const { name, color } = req.body;

  const updates = {};
  if (name) updates.name = name.trim().toLowerCase();
  if (color) updates.color = color;

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No valid fields to update");
  }

  const tag = await TagModel.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: updates },
    { returnDocument: "after", runValidators: true }
  );

  if (!tag) throw new ApiError(404, "Tag not found");

  return res
    .status(200)
    .json(new ApiResponse(200, tag, "Tag updated successfully"));
});

// DELETE /api/v1/tags/:id
export const deleteTag = asyncHandler(async (req, res) => {
  const tag = await TagModel.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!tag) throw new ApiError(404, "Tag not found");

  // Remove tag reference from all saves
  await SaveModel.updateMany(
    { user: req.user._id, tags: tag._id },
    { $pull: { tags: tag._id } }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tag deleted successfully"));
});

// PATCH /api/v1/tags/:id/saves/:saveId → add tag to save
export const addTagToSave = asyncHandler(async (req, res) => {
  const { id: tagId, saveId } = req.params;

  const tag = await TagModel.findOne({ _id: tagId, user: req.user._id });
  if (!tag) throw new ApiError(404, "Tag not found");

  const save = await SaveModel.findOneAndUpdate(
    { _id: saveId, user: req.user._id },
    { $addToSet: { tags: tagId } },
    { returnDocument: "after" }
  ).populate("tags", "name color");

  if (!save) throw new ApiError(404, "Save not found");

  return res
    .status(200)
    .json(new ApiResponse(200, save, "Tag added to save"));
});

// DELETE /api/v1/tags/:id/saves/:saveId → remove tag from save
export const removeTagFromSave = asyncHandler(async (req, res) => {
  const { id: tagId, saveId } = req.params;

  const save = await SaveModel.findOneAndUpdate(
    { _id: saveId, user: req.user._id },
    { $pull: { tags: tagId } },
    { returnDocument: "after" }
  ).populate("tags", "name color");

  if (!save) throw new ApiError(404, "Save not found");

  return res
    .status(200)
    .json(new ApiResponse(200, save, "Tag removed from save"));
});