import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

/**
 * Send Email Verification
 */
export const sendVerificationEmail = async (email, name, token) => {
  const verificationUrl = `${config.CLIENT_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"Snitch Support" <${config.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email - Snitch",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
        <h2>Welcome to Snitch, ${name}!</h2>
        <p>Please verify your email address to activate your account.</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("❌ Error sending verification email:", error.message);
    // Note: In production, you might want to throw this error so the controller can handle it
  }
};

/**
 * Send Password Reset
 */
export const sendPasswordResetEmail = async (email, name, token) => {
  const resetUrl = `${config.CLIENT_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Snitch Support" <${config.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password - Snitch",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
        <h2>Hello ${name},</h2>
        <p>You requested to reset your password. Click the button below to proceed:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, your account is safe and no action is needed.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("❌ Error sending password reset email:", error.message);
  }
};
