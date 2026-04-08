import mongoose from "mongoose";
import { config } from "./config.js";

const DB_NAME = "requiem";

const connectDB = async () => {
  try {
    const dbName = "requiem";
    // Check if URI already has a database name (ends with .net or .com without a trailing slash/name)
    const mongoUri = config.mongodbUri.includes("?") 
      ? config.mongodbUri.replace(".net/", `.net/${dbName}?`) 
      : config.mongodbUri.endsWith("/") 
        ? `${config.mongodbUri}${dbName}` 
        : config.mongodbUri.includes(".net") && !config.mongodbUri.split(".net")[1].includes("/")
          ? `${config.mongodbUri}/${dbName}`
          : config.mongodbUri;

    const connectionInstance = await mongoose.connect(mongoUri);
    console.log(`\n✅ MongoDB connected! Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;