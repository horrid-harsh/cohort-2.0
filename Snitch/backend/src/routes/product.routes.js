import { Router } from "express";
import {
  createProduct,
  getSellerProducts,
  getLatestProducts,
} from "../controllers/product.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createProductSchema } from "../validators/product.schema.js";

const router = Router();

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
 * @description Get latest products for homepage
 * @route GET /api/v1/product/latest
 * @access public
 */
router.get("/latest", getLatestProducts);

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

export default router;