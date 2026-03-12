import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Tag name is required"],
      trim: true,
      lowercase: true,
      maxlength: [50, "Tag name too long"],
    },
    color: { type: String, default: "#6366f1" },
    isAiGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

tagSchema.index({ user: 1, name: 1 }, { unique: true });

export const TagModel = mongoose.model("Tag", tagSchema);