import mongoose from "mongoose";

const DB_NAME = "requiem";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`\n✅ MongoDB connected! Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;