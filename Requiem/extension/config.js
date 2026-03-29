const isDev = false; // Set to true for local testing, false for production build

const API_BASE = isDev 
  ? "http://localhost:8000/api/v1" 
  : "https://cohort-2-0-1-mlj9.onrender.com/api/v1";

const APP_URL = isDev
  ? "http://localhost:5173"
  : "https://requiem-sync.vercel.app"; // your production frontend URL
