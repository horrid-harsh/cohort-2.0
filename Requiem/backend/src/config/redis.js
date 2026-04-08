import { config } from "./config.js";
import IORedis from "ioredis";

// Use 127.0.0.1 instead of localhost to avoid IPv6 resolution issues (::1)
const redisUrl = config.redisUrl || "redis://127.0.0.1:6379";

console.log("🛠️ Redis connecting to:", redisUrl.includes("@") ? "Remote Redis" : redisUrl);

export const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
});

connection.on("ready", () => {
  console.log("✅ Redis connected and ready!");
});

connection.on("error", (err) => console.error("❌ Redis Error:", err.message));