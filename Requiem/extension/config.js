// config.js
const isDev = true; // Set to true for local testing, false for production build

const API_BASE = isDev 
  ? "http://localhost:8000/api/v1" 
  : "https://your-production-url.com/api/v1";

const APP_URL = isDev
  ? "http://localhost:5173"
  : "https://yourdomain.com"; // your production frontend URL
