import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "local+google"],
      default: "local",
    },
    avatar: {
      type: String,
      default: "",
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    avatarFileId: {
      type: String,
      default: "",
    },
    refreshToken: {
      type: String,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpires: {
      type: Date,
      select: false,
    },
    lastVerificationSentAt: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordTokenExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

// Method to generate a verification token (JWT based to allow identification even after reuse)
userSchema.methods.generateVerificationToken = function () {
  const token = jwt.sign(
    { _id: this._id, email: this.email, purpose: "verification" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "24h" }
  );
  this.verificationToken = token;
  this.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  this.lastVerificationSentAt = new Date();
  return token;
};

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email },
    config.accessTokenSecret,
    { expiresIn: config.accessTokenExpiry }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    config.refreshTokenSecret,
    { expiresIn: config.refreshTokenExpiry }
  );
};

export const UserModel = mongoose.model("User", userSchema);