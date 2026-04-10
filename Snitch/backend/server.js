import connectDB from "./src/config/db.js";
import app from "./src/app.js";
import config from "./src/config/config.js";

const PORT = config.PORT;

process.on("uncaughtException", (err) => {
  console.error("❌ CRITICAL: Uncaught Exception:", err.message);
  console.error(err.stack);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ CRITICAL: Unhandled Rejection at:", promise, "reason:", reason);
});

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Snitch server running on port ${PORT}`);
  });
});
