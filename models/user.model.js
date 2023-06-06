const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  dob: Date,
  bio: String,
  posts: Array,
  friends: Array,
  friendRequests: Array,
});

const userModel = mongoose.model("user", userSchema);

module.exports = { userModel };
