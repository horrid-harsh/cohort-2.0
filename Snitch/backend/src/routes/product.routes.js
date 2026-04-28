import { Router } from "express";
import {
  createProduct,
  getSellerProducts,
  getLatestProducts,
  getExploreProducts,
  getAllProducts,
  getProductById,
  deleteProduct,
} from "../controllers/product.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createProductSchema } from "../validators/product.schema.js";

const router = Router();

/**
 * @description Get all products (with filters & pagination)
 * @route GET /api/v1/product
 * @access public
 */
router.get("/", getAllProducts);

/**
 * @description Create a new product
 * @route POST /api/v1/product
 * @access private
 */
router.post(
  "/", 
  authenticate, 
  authorize("seller"), 
  upload.array("images", 7), 
  validate(createProductSchema), 
  createProduct
);

/**
 * @description Get latest products for homepage (Top 8 New Arrivals)
 * @route GET /api/v1/product/latest
 * @access public
 */
router.get("/latest", getLatestProducts);

/**
 * @description Get explore products (skip top 8, paginated)
 * @route GET /api/v1/product/explore
 * @access public
 */
router.get("/explore", getExploreProducts);

/**
 * @description Get seller's products
 * @route GET /api/v1/product/seller
 * @access private
 */
router.get(
  "/seller",
  authenticate,
  authorize("seller"),
  getSellerProducts
);

/**
 * @description Get product details by ID
 * @route GET /api/v1/product/:productId
 * @access public
 */
router.get("/:productId", getProductById);

/**
 * @description Delete a product
 * @route DELETE /api/v1/product/:productId
 * @access private (seller only)
 */
router.delete(
  "/:productId",
  authenticate,
  authorize("seller"),
  deleteProduct
);

export default router;