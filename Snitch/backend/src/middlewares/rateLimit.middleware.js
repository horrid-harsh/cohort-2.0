import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import ApiError from "../utils/ApiError.js";
import config from "../config/config.js";

/**
 * Creates a customized rate limiter
 * @param {number} windowMs      - Timeframe in milliseconds
 * @param {number} maxRequests   - Max requests allowed in the timeframe
 * @param {string} message       - Custom error message
 * @param {Function} keyFn       - Optional custom key generator (req) => string
 */
const createLimiter = (windowMs, maxRequests, message, keyFn = null) => {
  return rateLimit({
    windowMs: windowMs,
    max: maxRequests,
    standardHeaders: "draft-7",
    legacyHeaders: false,

    // composite key strategy (IP + email) when keyFn provided
    // Falls back to req.ip for non-body routes
    keyGenerator: keyFn || ((req) => ipKeyGenerator(req)),

    handler: (req, res, next, options) => {
      next(new ApiError(429, message || "Too many requests. Please try again later."));
    },
  });
};

// ─── Key Generators ───────────────────────────────────────────────────────────

// For login/forgot-password: key on IP + email so rotating IPs don't bypass limits
const ipPlusEmailKey = (req) => {
  const ip = ipKeyGenerator(req); 

  if (!req.body?.email) return ip;
  return `${ip}:${req.body.email.toLowerCase().trim()}`;
};

// ─── Route-Specific Limiters ──────────────────────────────────────────────────

// /register — 5 requests / hour
export const registerLimiter = createLimiter(
  60 * 60 * 1000,
  5,
  "Too many accounts created from this IP. Please try again after an hour."
);

// /login — 10 requests / 15 min, keyed on IP + email
export const loginLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  "Too many login attempts. Please try again after 15 minutes.",
  ipPlusEmailKey
);

// /forgot-password — 5 requests / hour, keyed on IP + email
export const forgotPasswordLimiter = createLimiter(
  60 * 60 * 1000,
  5,
  "Too many password reset requests. Please try again after an hour.",
  ipPlusEmailKey
);

// /resend-verification — 5 requests / hour
export const resendVerificationLimiter = createLimiter(
  60 * 60 * 1000,
  5,
  "Too many verification emails requested. Please try again after an hour."
);

// /refresh-token — tight limit, IP only
export const refreshTokenLimiter = createLimiter(
  15 * 60 * 1000,
  20,
  "Too many token refresh attempts. Please log in again."
);

// ─── Global Fallback ──────────────────────────────────────────────────────────
export const globalLimiter = createLimiter(
  config.RATE_LIMIT_WINDOW_MS,
  config.RATE_LIMIT_MAX,
  "Too many requests from this IP. Please try again later."
);