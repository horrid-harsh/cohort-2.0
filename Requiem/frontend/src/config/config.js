const isProduction = import.meta.env.PROD;

export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 
    (isProduction 
      ? "https://cohort-2-0-1-mlj9.onrender.com/api/v1" 
      : "http://localhost:8000/api/v1"),
  appUrl: isProduction 
    ? "https://requiem-sync.vercel.app" 
    : "http://localhost:5173",
  isProduction,
};
