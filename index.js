const express = require("express");
const app = express();

const { connection } = require("./config/config.db");
const { userRouter } = require("./routes/user.route");
const { auth } = require("./middleware/auth.middleware");
const { friendAndPostRouter } = require("./routes/userFriendsAndPosts.route");
const { postRouter } = require("./routes/posts.route");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("welcome to social media app");
});

app.use(userRouter);
app.use(auth);
app.use(friendAndPostRouter);
app.use(postRouter);

app.listen("4500", async (req, res) => {
  try {
    await connection;
    console.log("db connected");
  } catch (error) {
    console.log(error);
  }
  console.log("server running at port 4500");
});
