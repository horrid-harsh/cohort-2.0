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

export const getSellerProducts = asyncHandler(async (req, res) => {
  const seller = req.user;
  const products = await Product.find({ seller: seller._id });
  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

// ─── @route  GET /api/v1/product/latest ──────────────────────────────────────
// @access  Public
export const getLatestProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .sort({ createdAt: -1 })
    .limit(8)
    .select("-seller -__v");

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Latest products fetched successfully"));
});

// ─── @route  GET /api/v1/product/explore ─────────────────────────────────────
// @access  Public
const NEW_ARRIVALS_LIMIT = 8;

export const getExploreProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;

  const skipCount = NEW_ARRIVALS_LIMIT + (page - 1) * limit;

  const [products, totalProductsCount] = await Promise.all([
    Product.find({})
      .sort({ createdAt: -1 })
      .skip(skipCount)
      .limit(limit)
      .select("-seller -__v"),
    Product.countDocuments()
  ]);

  const remainingCount =
    totalProductsCount > NEW_ARRIVALS_LIMIT
      ? totalProductsCount - NEW_ARRIVALS_LIMIT
      : 0;

  const totalPages = Math.ceil(remainingCount / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          page,
          limit,
          totalPages,
          totalProducts: remainingCount,
          hasNextPage: page < totalPages,
        },
      },
      "Explore products fetched successfully"
  )
)});

// ─── @route  GET /api/v1/product ─────────────────────────────────────────────
// @access  Public
// General product listing with support for filters (category, gender, search) and pagination
export const getAllProducts = asyncHandler(async (req, res) => {
  const { category, gender, search, page = 1, limit = 12 } = req.query;

  const query = {};
  
  if (category) query.category = category;
  if (gender) query.gender = gender;
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 12));
  const skip = (pageNum - 1) * limitNum;

  const [products, totalProducts] = await Promise.all([
    Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select("-seller -__v"),
    Product.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalProducts / limitNum);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalPages,
          totalProducts,
          hasNextPage: pageNum < totalPages,
        },
      },
      "Products fetched successfully"
    )
  );
});