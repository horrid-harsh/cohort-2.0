const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userModel = require("../models/user.model");
const refreshTokenModel = require("../models/refreshToken.model");
const redis = require("../config/cache");
const sendEmail = require("../utils/nodemailer");

const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await userModel.create({ username, email, password });

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    await refreshTokenModel.create({ userId: user._id, token: refreshToken });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const loginController = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Email or username and password are required" });
    }

    const user = await userModel
      .findOne({ $or: [{ email: identifier }, { username: identifier }] })
      .select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1m",
      },
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" },
    );
    await refreshTokenModel.create({ userId: user._id, token: refreshToken });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res
      .status(200)
      .json({ message: "User logged in successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getMeController = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const logoutController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(200).json({ message: "Logged out" });
    }
    await refreshTokenModel.deleteOne({ token: refreshToken });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const refreshController = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    const tokenInDB = await refreshTokenModel.findOne({ token: refreshToken });

    if (!tokenInDB) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({ message: "Token refreshed" });
  } catch (error) {
    console.error(error);
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await userModel.findOne({ email });
    // Always return same response (prevent email enumeration)
    if (!user) {
      return res.status(200).json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    //Generate random token
    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetPasswordToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset",
        text: `Reset your password here: ${resetUrl}`,
      });
      // console.log("Forgot password email sent successfully to " + user.email);
    } catch (emailError) {
      // console.error("Error sending forgot password email:", emailError);
      return res.status(500).json({ message: "Error sending reset email." });
    }

    return res.status(200).json({
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (error) {
    // console.error("Forgot password controller error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const resetPasswordController = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await userModel
    .findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    })
    .select("+password");

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return res.status(200).json({ message: "Password reset successfully" });
};

const googleAuthController = async (req, res) => {
  try {
    const { googleId, name, email } = req.user;

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        username: name,
        email,
        googleId,
        authProvider: "google",
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    await refreshTokenModel.create({
      userId: user._id,
      token: refreshToken,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(process.env.CLIENT_URL + "/");
  } catch (error) {
    console.error(error);
    res.redirect(process.env.CLIENT_URL + "/login");
  }
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  getMeController,
  refreshController,
  forgotPasswordController,
  resetPasswordController,
  googleAuthController,
};
