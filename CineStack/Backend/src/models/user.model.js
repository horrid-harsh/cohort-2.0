const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      maxLength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minLength: [8, "Password must be at least 8 characters"],
      select: false, // Don't return password by default in queries
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

/**
 * Pre-save Hook: Hash password before saving to database
 */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance Method: Compare entered password with hashed password in DB
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Instance Method: Generate JWT Token for user authentication
 */
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
