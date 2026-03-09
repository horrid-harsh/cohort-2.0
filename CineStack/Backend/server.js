/**
 * File: server.js
 * Description: Main entry point for the CineStack Backend Server.
 * Responsible for Environment setup, DB connection, and Server startup.
 */

// Load environment variables immediately as the very first step
require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/database");

const PORT = Number(process.env.PORT) || 5000;

// Connect to the database before launching the server
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(
      `\n\x1b[36m%s\x1b[0m`,
      `🚀 CineStack Server is running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`,
    );
  });

  /**
   * Graceful Shutdown for Production Stability
   * This handles unexpected errors (unhandledRejections) and signals like SIGTERM
   */
  process.on("unhandledRejection", (err) => {
    console.error(`\x1b[31m%s\x1b[0m`, `✖ Unhandled Rejection: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });

  // Handle system's termination and interruption signals (SIGTERM, SIGINT)
  process.on("SIGTERM", () => {
    console.log("👋 SIGTERM received. Shutting down gracefully...");
    server.close(() => {
      console.log("💥 Process terminated!");
    });
  });
});
