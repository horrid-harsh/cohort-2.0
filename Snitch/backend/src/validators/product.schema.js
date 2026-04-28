import { z } from "zod";

export const createProductSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters")
    .regex(/^[a-zA-Z0-9\s\-.,':&()\/!]+$/, "Title contains invalid characters")
    .refine((val) => /[a-zA-Z]/.test(val), {
      message: "Title must contain at least one letter",
    })
    .refine((val) => !/(.)\1{4,}/.test(val), {
      message: "Title looks spammy",
    }),

  description: z
    .string({ required_error: "Description is required" })
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters"),

  priceAmount: z.coerce
    .number({ required_error: "Price amount is required" })
    .refine((val) => !isNaN(val), {
      message: "Price must be a valid number",
    })
    .positive("Price must be a positive number")
    .max(1_000_000, "Price is too high"),

  priceCurrency: z
    .enum(["INR", "USD"], {
      invalid_type_error: "Currency must be either INR or USD",
    })
    .default("INR"),

  category: z.enum(
    [
      "shirts",
      "jeans",
      "trousers",
      "jackets",
      "t-shirts",
      "co-ords",
      "shorts",
    ],
    { required_error: "Category is required" },
  ),

  gender: z.enum(["men", "women", "kids", "unisex"], {
    required_error: "Gender is required",
  }),

  groupId: z.string().optional(),

  stock: z.coerce.number().optional().default(0),

  attributes: z.string().optional(), // Received as stringified JSON in multipart
});
