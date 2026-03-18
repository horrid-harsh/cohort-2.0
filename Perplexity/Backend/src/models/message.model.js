import mongoose from "mongoose";

const sourceSchema = new mongoose.Schema(
  {
    title: String,
    url: String,
    favicon: String,
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Message content is required"],
      maxlength: [10000, "Message cannot exceed 10000 characters"],
    },
    role: {
      type: String,
      enum: ["user", "ai"],
      required: [true, "Message role is required"],
    },
    sources: {
      type: [sourceSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Index for fast message retrieval per chat
messageSchema.index({ chat: 1, createdAt: 1 });

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;
