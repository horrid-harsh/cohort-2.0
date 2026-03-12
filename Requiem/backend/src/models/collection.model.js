import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Collection name is required"],
      trim: true,
      maxlength: [100, "Name too long"],
    },
    description: { type: String, trim: true, default: "" },
    emoji: { type: String, default: "📁" },
    color: { type: String, default: "#6366f1" },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const CollectionModel = mongoose.model("Collection", collectionSchema);