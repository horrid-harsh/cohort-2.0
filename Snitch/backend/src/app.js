import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// ─── Security ────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: config.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

// ─── Body Parsers ────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ─── Logger ──────────────────────────────────────────────────────────
if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── Health Check ────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Snitch API is up and running 🚀",
    environment: config.NODE_ENV,
  });
});

// ─── API Routes (uncomment as you build) ─────────────────────────────
app.use("/api/v1/auth", authRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ────────────────────────────────────────────
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error(`[ERROR] ${statusCode} - ${message}`);
  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    ...(config.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;