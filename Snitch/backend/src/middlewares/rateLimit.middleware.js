import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import ApiError from "../utils/ApiError.js";

/**
 * Creates a customized rate limiter
 * @param {number} windowMinutes - Timeframe in minutes
 * @param {number} maxRequests   - Max requests allowed in the timeframe
 * @param {string} message       - Custom error message
 * @param {Function} keyFn       - Optional custom key generator (req) => string
 */
const createLimiter = (windowMinutes, maxRequests, message, keyFn = null) => {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max: maxRequests,
    standardHeaders: "draft-7",
    legacyHeaders: false,

    // ✅ Fix #4: composite key strategy (IP + email) when keyFn provided
    // Falls back to req.ip for non-body routes
    keyGenerator: keyFn || ((req) => ipKeyGenerator(req)),

    // ✅ Fix #1: use next() not throw — handler is outside Express error chain
    handler: (req, res, next, options) => {
      next(new ApiError(429, message || "Too many requests. Please try again later."));
    },
  });
};

// ─── Key Generators ───────────────────────────────────────────────────────────

// For login/forgot-password: key on IP + email so rotating IPs don't bypass limits
const ipPlusEmailKey = (req) => {
  const ip = ipKeyGenerator(req); // ✅ safe IP

  if (!req.body?.email) return ip;
  return `${ip}:${req.body.email.toLowerCase().trim()}`;
};

// ─── Route-Specific Limiters ──────────────────────────────────────────────────

// /register — 5 requests / hour (IP only — email not available yet)
export const registerLimiter = createLimiter(
  60,
  5,
  "Too many accounts created from this IP. Please try again after an hour."
);

// /login — 10 requests / 15 min, keyed on IP + email
export const loginLimiter = createLimiter(
  15,
  10,
  "Too many login attempts. Please try again after 15 minutes.",
  ipPlusEmailKey
);

// /forgot-password — 5 requests / hour, keyed on IP + email
export const forgotPasswordLimiter = createLimiter(
  60,
  5,
  "Too many password reset requests. Please try again after an hour.",
  ipPlusEmailKey
);

// /resend-verification — 5 requests / hour (IP only)
export const resendVerificationLimiter = createLimiter(
  60,
  5,
  "Too many verification emails requested. Please try again after an hour."
);

// ✅ Fix #2: /refresh-token — tight limit, IP only (no body email on this route)
export const refreshTokenLimiter = createLimiter(
  15,
  20,
  "Too many token refresh attempts. Please log in again."
);

// ─── Global Fallback ──────────────────────────────────────────────────────────
export const globalLimiter = createLimiter(
  15,
  100,
  "Too many requests from this IP. Please try again later."
);