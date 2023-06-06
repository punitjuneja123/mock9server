const mongoose = require("mongoose");
const postSchema = mongoose.Schema({
  user: String,
  text: String,
  image: String,
  createdAt: Date,
  likes: Number,
  comments: Array,
});

const postModel = mongoose.model("post", postSchema);

module.exports = { postModel };
