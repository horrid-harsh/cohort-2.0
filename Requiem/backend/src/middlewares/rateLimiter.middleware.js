import rateLimit, { ipKeyGenerator } from "express-rate-limit";

// ─── Auth routes — strict (prevent brute force) ───
// 20 attempts per 15 mins per IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── General API — relaxed ─────────────────────────
// 500 requests per 15 mins
// GETs are skipped entirely — no point limiting reads
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: {
    success: false,
    message: "Too many requests, please slow down.",
  },
  skip: (req) => req.method === "GET",
  keyGenerator: (req) => req.user?._id?.toString() || ipKeyGenerator(req),
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── AI routes — expensive operations ─────────────
// 60 saves per hour (each save triggers AI tagging + embedding)
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 60,
  message: {
    success: false,
    message: "Hourly save limit reached, try again later.",
  },
  skip: (req) => !req.user,
  keyGenerator: (req) => req.user?._id?.toString() || ipKeyGenerator(req),
  standardHeaders: true,
  legacyHeaders: false,
});