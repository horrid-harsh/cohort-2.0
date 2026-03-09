/**
 * File: scripts/createAdmin.js
 * Description: One-time script to seed the initial admin account.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/user.model");

const createAdmin = async () => {
  try {
    // 1. Validate Environment Variables
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, MONGODB_URI } =
      process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD || !MONGODB_URI) {
      console.error(
        "✖ Missing required environment variables (ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, or MONGODB_URI)",
      );
      process.exit(1);
    }

    // 2. Connect to Database
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✔ Connected to MongoDB");

    // 3. Check if Admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log(`ℹ Admin already exists with email: ${ADMIN_EMAIL}`);
      process.exit(0);
    }

    // 4. Create Admin User
    // Note: Password hashing is handled by the model's pre-save hook
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    });

    console.log(`\x1b[32m%s\x1b[0m`, `✔ Admin User created successfully!`);
    console.log(`Email: ${ADMIN_EMAIL}`);
  } catch (error) {
    console.error(
      `\x1b[31m%s\x1b[0m`,
      `✖ Error creating admin: ${error.message}`,
    );
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
};

createAdmin();
