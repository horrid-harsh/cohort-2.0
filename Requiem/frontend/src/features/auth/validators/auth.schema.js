import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email format"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine((val) => /[A-Z]/.test(val), {
      message: "Must include uppercase letter",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Must include lowercase letter",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Must include number",
    })
    .refine((val) => /[\W]/.test(val), {
      message: "Must include special character",
    }),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});
