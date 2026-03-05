const express = require("express");
const connectToDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const session = require("express-session");
const passport = require("passport");

require("./config/passport"); // loads Google strategy

const authRoutes = require("./routes/auth.routes");
const songRoutes = require("./routes/song.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173"], // frontend URL
    credentials: true, // allow cookies
  })
);

/* Session middleware (required by passport) */
// app.use(
//   session({
//     secret: "google-auth-secret",
//     resave: false,
//     saveUninitialized: true,
//   })
// );

/* Initialize passport */
app.use(passport.initialize());
// app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/song", songRoutes);

connectToDB();

module.exports = app;