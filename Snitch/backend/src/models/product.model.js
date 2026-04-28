import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      amount: { type: Number, required: true },
      currency: { type: String, enum: ["INR", "USD"], default: "INR" },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "shirts",
        "jeans",
        "trousers",
        "jackets",
        "t-shirts",
        "co-ords",
        "shorts",
      ],
      lowercase: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    gender: {
      type: String,
      enum: ["men", "women", "kids", "unisex"],
      required: true,
    },
    images: [
      {
        url: { type: String, required: true },
        fileId: { type: String, required: true },
      },
    ],
    // ─── Grouping Variant Logic ──────────────────────────────────────────
    groupId: {
      type: String, // Can be a UUID or a unique string
      required: true,
      index: true,
    },
    attributes: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    stock: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
