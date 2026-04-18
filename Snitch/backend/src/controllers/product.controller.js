import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadFile, deleteFile } from "../services/storage.service.js";
import Product from "../models/product.model.js";

// ─── Helper: rollback already-uploaded images if something fails ──────────────
const rollbackUploads = async (uploadedImages) => {
  if (!uploadedImages?.length) return;
  await Promise.allSettled(
    uploadedImages.map((img) => deleteFile(img.fileId))
  );
};

// ─── @route  POST /api/v1/product ─────────────────────────────────────────────
// @access  Private — seller only
export const createProduct = asyncHandler(async (req, res) => {
  const { title, description, priceAmount, priceCurrency, category, gender } =
    req.body;
  const seller = req.user;

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "At least one product image is required");
  }

  let images = [];
  try {
    images = await Promise.all(
      req.files.map(async (file) => {
        const result = await uploadFile(
          file.buffer,
          `${Date.now()}-${file.originalname}`,
          "products",
        );
        return {
          url: result.url,
          fileId: result.fileId,
        };
      }),
    );
  } catch (error) {
    throw new ApiError(500, "Failed to upload images. Please try again.");
  }

  let product;
  try {
    product = await Product.create({
      title,
      description,
      price: {
        amount: priceAmount,
        currency: priceCurrency || "INR",
      },
      category,
      gender,
      images,
      seller: seller._id,
    });
  } catch (error) {
    await rollbackUploads(images);
    throw new ApiError(500, "Failed to create product. Please try again.");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});
