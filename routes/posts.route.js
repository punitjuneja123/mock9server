const express = require("express");
const postRouter = express.Router();
require("dotenv").config();

const { postModel } = require("../models/posts.model");

postRouter.post("/api/posts", async (req, res) => {
  let payload = req.body;
  payload.user = payload.userID;
  let postData = await new postModel(payload);
  postData.save();
  res.status(201);
  res.send("posted");
});

postRouter.get("/api/posts", async (req, res) => {
  let postData = await postModel.find({ user: req.body.userID });
  res.send(postData);
});

postRouter.patch("/api/posts/:id", async (req, res) => {
  let id = req.params.id;
  let payload = req.body;
  await postModel.findByIdAndUpdate({ _id: id }, payload);
  res.send("updated");
});

postRouter.get("/api/posts/:id", async (req, res) => {
  let postData = await postModel.find({ _id: req.params.id });
  res.send(postData);
});

module.exports = { postRouter };

// {
//     "text": "New post 1",
//   "image": "image URL",
//   "createdAt": "2023/06/06"
// }
