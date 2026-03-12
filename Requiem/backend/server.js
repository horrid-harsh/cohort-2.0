import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";

dotenv.config(); // load .env before anything else

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Requiem server running on http://localhost:${PORT}`);
  });
});