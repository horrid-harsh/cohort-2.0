const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: [true, "User with this email already exists!!"],
  },
  password: String,
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
