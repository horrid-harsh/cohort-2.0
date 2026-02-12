const userModel = require("../models/user.model");
const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

async function registerController(req, res) {
  const { username, email, password, bio, profileImage } = req.body;

  const existingUser = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    return res.status(409).json({
      message:
        "User already exists with this " +
        (existingUser.email === email ? "email" : "username"),
    });
  }

  //   const hash = crypto.createHash('sha256').update(password).digest('hex');
  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
    profileImage,
    bio,
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  return res.status(201).json({
    message: "User registered successfully",
    user,
  });
}

async function loginController(req, res) {
  const { username, email, password } = req.body;
  const user = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  // const hash = crypto.createHash('sha256').update(password).digest('hex');
  // const ispasswordValid = hash === user.password;
  const ispasswordValid = await bcrypt.compare(password, user.password);

  if (!ispasswordValid) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  return res.status(200).json({
    message: "User login succesful",
    user: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
}

module.exports = {
    registerController, loginController
}