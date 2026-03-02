const express = require("express");
const connectToDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"], // frontend URL
    credentials: true, // allow cookies
  })
);
app.use("/api/auth", authRoutes);

connectToDB();

module.exports = app;