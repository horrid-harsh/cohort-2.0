import mongoose from "mongoose";

const SAVE_TYPES = ["article", "tweet", "video", "pdf", "image", "link"];

const saveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: SAVE_TYPES,
      default: "link",
    },
    title: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    thumbnail: { type: String, default: "" },
    siteName: { type: String, default: "" },
    favicon: { type: String, default: "" },
    note: { type: String, trim: true, default: "" },
    highlights: [
      {
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    content: {
      type: String,
      default: "",
      select: false,
    },
    embedding: {
      type: [Number],
      default: undefined,
      select: false,
    },
    embeddingVersion: {
      type: Number,
      default: 0,
    },
    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
    lastSurfacedAt: { type: Date, default: null },
    surfaceCount: { type: Number, default: 0 },
    isFavorite: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    processingStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

saveSchema.index({ user: 1, createdAt: -1 });
saveSchema.index({ user: 1, isArchived: 1 });
saveSchema.index({ user: 1, isFavorite: 1 });

export const SaveModel = mongoose.model("Save", saveSchema);