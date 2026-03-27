import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./middlewares/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
import authRoutes from "./routes/auth.routes.js";
import savesRoutes from "./routes/saves.routes.js";
import collectionsRoutes from "./routes/collections.routes.js";
import tagsRoutes from "./routes/tags.routes.js";
import graphRoutes from "./routes/graph.routes.js";
import clusterRoutes from "./routes/cluster.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "data:", "https:", "http:"],
        "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        "font-src": ["'self'", "https://fonts.gstatic.com"],
      },
    },
  })
);

app.use(
  cors({
    origin: [process.env.CORS_ORIGIN || "http://localhost:5173", /^chrome-extension:\/\//],
    credentials: true, // allow cookies
  })
);

// Body parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

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
app.use("/api/v1/clusters", clusterRoutes);
app.use("/api/v1/users", userRoutes);

// Serve frontend for any other route
app.get("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Global error handler — must be last
app.use(errorHandler);

export default app;