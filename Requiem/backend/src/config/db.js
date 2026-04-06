import mongoose from "mongoose";
import { config } from "./config.js";

const DB_NAME = "requiem";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${config.mongodbUri}/${DB_NAME}`
    );
    console.log(`\n✅ MongoDB connected! Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;