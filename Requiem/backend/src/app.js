import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import { errorHandler } from "./middlewares/error.middleware.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import savesRoutes from "./routes/saves.routes.js";
import collectionsRoutes from "./routes/collections.routes.js";
import tagsRoutes from "./routes/tags.routes.js";
import graphRoutes from "./routes/graph.routes.js";

const app = express();

// Security middlewares
app.use(helmet());
app.use(
  cors({
    origin: [process.env.CORS_ORIGIN || "http://localhost:5173", /^chrome-extension:\/\//],
    credentials: true, // allow cookies
  })
);

// Rate limiting — max 100 requests per 15 mins per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});
app.use("/api", limiter);

// Body parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Logger (only in development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Requiem server is running" });
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/saves", savesRoutes);
app.use("/api/v1/collections", collectionsRoutes);
app.use("/api/v1/tags", tagsRoutes);
app.use("/api/v1/graph", graphRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler — must be last
app.use(errorHandler);

export default app;