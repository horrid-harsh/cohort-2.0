/**
 * Utility: Create token and save in cookie
 * This ensures consistency across register, login, and potentially refreshToken flows.
 */
const sendToken = (user, statusCode, res, message = "Authentication successful") => {
  const token = user.getJwtToken();

  const cookieExpireDays = process.env.JWT_COOKIE_EXPIRE || 30;

  // Cookie options for security
  const options = {
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
    sameSite: "strict", // Protects against CSRF
    maxAge: cookieExpireDays * 24 * 60 * 60 * 1000,
  };

  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message,
    token,
    user: userData,
  });
};

module.exports = sendToken;
