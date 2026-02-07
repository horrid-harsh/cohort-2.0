const express = require("express");
const authRouter = express.Router();
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({ email });

  if (isUserAlreadyExists) {
    return res.status(409).json({
      message: "User already exists with this email address",
    });
  }

  const user = await userModel.create({
    name,
    email,
    password,
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
  );

  res.cookie('jwt_token', token);

  res.status(201).json({
    message: "User registered successfully",
    user,
    token
  });
});


module.exports = authRouter;
