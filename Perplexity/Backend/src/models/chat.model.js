import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "New Chat",
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
  },
  { timestamps: true },
);

chatSchema.index({ user: 1, createdAt: -1 });

const chatModel = mongoose.model("Chat", chatSchema);

export default chatModel;
