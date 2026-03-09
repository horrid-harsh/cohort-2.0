const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const ErrorHandler = require("./middlewares/errorMiddleware");

const app = express();

/**
 * 1. Security Headers (Helmet)
 * 2. CORS Policy
 * 3. Body Parsers (JSON, URL Encoded, Cookies)
 * 4. Logging (Morgan)
 * 5. Rate Limiting (Preventing Brute Force)
 */

// Basic Middleware
app.use(helmet());

// CORS configuration - allowing credentials for cookies
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Body parsing middleware
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

// Logging in development
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Simple Rate Limiting (can be customized per route later)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use("/api", limiter);

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Import Routes
const authRoutes = require("./routes/auth.routes");
const movieRoutes = require("./routes/movie.routes");

// Mount Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movies", movieRoutes);

// Error Handling Middleware (must be after all routes)
app.use(ErrorHandler);

module.exports = app;
