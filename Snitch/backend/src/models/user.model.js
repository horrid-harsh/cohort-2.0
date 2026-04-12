import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";  // default import, matches your config.js

const addressSchema = new mongoose.Schema(
  {
    fullName:  { type: String, required: true, trim: true },
    phone:     { type: String, required: true, trim: true },
    line1:     { type: String, required: true, trim: true }, // house/flat/street
    city:      { type: String, required: true, trim: true },
    state:     { type: String, required: true, trim: true },
    pincode:   { type: String, required: true, trim: true },
    country:   { type: String, default: "India", trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true } // each address gets its own _id — useful for edit/delete by id
);

const userSchema = new mongoose.Schema(
  {
    // ─── Core Identity ──────────────────────────────────────────────
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
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      unique: true,
    },

    // ─── Auth ────────────────────────────────────────────────────────
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,   // allows multiple null values (users without Google)
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "local+google"],
      default: "local",
    },
    role: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer",
    },
    refreshToken: {
      type: String,
      select: false,
    },

    // ─── Avatar ──────────────────────────────────────────────────────
    avatar: {
      url:    { type: String, default: "" },
      fileId: { type: String, default: "" }, // for Cloudinary/ImageKit deletion
    },

    // ─── Account Status ──────────────────────────────────────────────
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,  // set false to soft-ban a user without deleting
    },

    // ─── Email Verification ──────────────────────────────────────────
    verificationToken:        { type: String, select: false },
    verificationTokenExpires: { type: Date,   select: false },
    lastVerificationSentAt:   { type: Date,   default: null },

    // ─── Password Reset ───────────────────────────────────────────────
    resetPasswordToken:         { type: String, select: false },
    resetPasswordTokenExpires:  { type: Date,   select: false },

    // ─── E-commerce Specific ─────────────────────────────────────────
    addresses: {
      type: [addressSchema],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 5,
        message: "You can save a maximum of 5 addresses",
      },
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────
// email already indexed via unique:true
// Add this for admin dashboards filtering by role/status
userSchema.index({ role: 1, isActive: 1 });

// ─── Pre-save: Hash password ──────────────────────────────────────────
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// ─── Methods ──────────────────────────────────────────────────────────
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, role: this.role },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    config.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

userSchema.methods.generateVerificationToken = function () {
  const token = jwt.sign(
    { _id: this._id, email: this.email, purpose: "email-verification" },
    config.JWT_SECRET,
    { expiresIn: "24h" }
  );
  this.verificationToken = token;
  this.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  this.lastVerificationSentAt = new Date();
  return token;
};

userSchema.methods.generateResetPasswordToken = function () {
  const token = jwt.sign(
    { _id: this._id, purpose: "password-reset" },
    config.JWT_SECRET,
    { expiresIn: "1h" }
  );
  this.resetPasswordToken = token;
  this.resetPasswordTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
  return token;
};

export const User = mongoose.model("User", userSchema);