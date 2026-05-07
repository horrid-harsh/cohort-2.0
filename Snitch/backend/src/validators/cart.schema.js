import { z } from "zod";

/**
 * Schema for adding a product to the cart
 */
export const addToCartSchema = z.object({
  productId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Product ID format")
    .min(1, "Product ID is required"),
  
  size: z
    .string()
    .trim()
    .min(1, "Please select a size"),
  
  quantity: z
    .coerce.number({
      invalid_type_error: "Quantity must be a number",
    })
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1")
    .max(10, "You can add a maximum of 10 units per item")
    .default(1),
  
  guestId: z
    .string()
    .optional(),
});

/**
 * Schema for updating item quantity in the cart
 */
export const updateCartItemSchema = z.object({
  productId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Product ID format"),
  
  size: z
    .string()
    .min(1, "Size is required"),
  
  quantity: z
    .coerce.number()
    .int()
    .min(1, "Quantity cannot be less than 1")
    .max(10, "Maximum 10 units allowed"),
  
  newSize: z
    .string()
    .optional(),

  guestId: z
    .string()
    .optional(),
});

/**
 * Schema for merging guest cart into user cart
 */
export const mergeCartSchema = z.object({
  guestId: z
    .string()
    .min(1, "Guest ID is required to merge carts"),
});

/**
 * Schema for removing an item from the cart
 */
export const removeFromCartSchema = z.object({
  productId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Product ID format"),
  
  size: z
    .string()
    .min(1, "Size is required"),
  
  guestId: z
    .string()
    .optional(),
});
