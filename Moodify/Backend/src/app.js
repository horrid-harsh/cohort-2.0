const express = require("express");
const connectToDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
// const session = require("express-session");
const passport = require("passport");

require("./config/passport"); // loads Google strategy

const authRoutes = require("./routes/auth.routes");
const songRoutes = require("./routes/song.routes");

const app = express();

app.set("trust proxy", 1);

app.use(express.json());

app.use(cookieParser());
app.use(express.static("./public"));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // allow cookies
  }),
);

/* Initialize passport */
app.use(passport.initialize());
// app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/song", songRoutes);

// Catch-all route to serve the frontend (for client-side routing)
app.use("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

connectToDB();

module.exports = app;
