const express = require("express");
const connectToDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

connectToDB();

module.exports = app;