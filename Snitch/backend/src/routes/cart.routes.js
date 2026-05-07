import express from "express";
import { addToCart, mergeCart, removeFromCart, getCart, updateCartItem } from "../controllers/cart.controller.js";
import { authenticate, optionalAuthenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { addToCartSchema, mergeCartSchema, removeFromCartSchema, updateCartItemSchema } from "../validators/cart.schema.js";

const router = express.Router();

/**
 * @route   GET /api/v1/cart
 * @desc    Get user or guest cart
 * @access  Public
 */
router.route("/").get(
    optionalAuthenticate,
    getCart
);

/**
 * @route   POST /api/v1/cart/add
 * @desc    Add a product to user's cart (Guest or Authenticated)
 * @access  Public
 */
router.route("/add").post(
    optionalAuthenticate,
    validate(addToCartSchema),
    addToCart
);

/**
 * @route   POST /api/v1/cart/merge
 * @desc    Merge guest cart into user cart
 * @access  Private (Logged-in users)
 */
router.route("/merge").post(
    authenticate,
    validate(mergeCartSchema),
    mergeCart
);

/**
 * @route   PATCH /api/v1/cart/update
 * @desc    Update item quantity
 * @access  Public
 */
router.route("/update").patch(
    optionalAuthenticate,
    validate(updateCartItemSchema),
    updateCartItem
);

/**
 * @route   DELETE /api/v1/cart/remove
 * @desc    Remove an item from cart
 * @access  Public
 */
router.route("/remove").delete(
    optionalAuthenticate,
    validate(removeFromCartSchema),
    removeFromCart
);

export default router;