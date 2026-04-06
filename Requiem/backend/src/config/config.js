import dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export const config = {
  port: process.env.PORT || 8000,
  mongodbUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV || "development",
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || "15m",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  frontendUrl: process.env.FRONTEND_URL || (isProduction ? "https://requiem-sync.vercel.app" : "http://localhost:5173"),
  backendUrl: process.env.BACKEND_URL || (isProduction ? "https://cohort-2-0-1-mlj9.onrender.com" : "http://localhost:8000"),
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  mistralApiKey: process.env.MISTRAL_API_KEY,
  redisUrl: process.env.REDIS_URL,
  resendApiKey: process.env.RESEND_API_KEY,
  fromEmail: process.env.FROM_EMAIL || "onboarding@resend.dev",
  supabaseUrl: process.env.VITE_SUPABASE_URL, // Backend also uses this name sometimes
  supabaseKey: process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
};
