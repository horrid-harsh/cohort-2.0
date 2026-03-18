import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import { globalRateLimiter } from "./middlewares/rateLimiter.middleware.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Request logging (only in development)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Body parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Prevent HTTP parameter pollution
app.use(hpp());

// Global rate limiter
app.use(globalRateLimiter);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

export { app };
