import "dotenv/config";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";
import "./src/jobs/save.worker.js"; // Auto-start background worker

const PORT = process.env.PORT || 8000;

process.on("uncaughtException", (err) => {
  console.error("❌ CRITICAL: Uncaught Exception:", err.message);
  console.error(err.stack);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ CRITICAL: Unhandled Rejection at:", promise, "reason:", reason);
});

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Requiem server running on port ${PORT}`);
  });
});
