const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { userModel } = require("../models/user.model");

userRouter.post("/api/register", async (req, res) => {
  let payload = req.body;
  let checkUser = await userModel.find({ email: payload.email });
  if (checkUser.length > 0) {
    res.status(401);
    res.send("user already exists");
  } else {
    bcrypt.hash(payload.password, 5, async (err, hash) => {
      if (err) {
        console.log(err);
        res.status(400);
        res.send("something went wrong");
      } else {
        payload.password = hash;
        let registerUser = await new userModel(payload);
        registerUser.save();
        res.status(201);
        res.send("user register");
      }
    });
  }
});

userRouter.post("/api/login", async (req, res) => {
  let payload = req.body;
  let userData = await userModel.find({ email: payload.email });
  if (userData.length > 0) {
    bcrypt.compare(payload.password, userData[0].password, (err, response) => {
      if (response) {
        let token = jwt.sign({ userID: userData[0]._id }, process.env.secret);
        res.send({ msg: "user registeres", token: token });
      } else {
        console.log(err);
        res.status(400);
        res.send("something went wrong");
      }
    });
  } else {
    res.status(400);
    res.send("invalid email ID");
  }
});

userRouter.get("/api/users", async (req, res) => {
  try {
    let allUsers = await userModel.find();
    res.send(allUsers);
  } catch (error) {
    console.log(error);
    res.status(400);
    res.send("something went wrong");
  }
});



module.exports = { userRouter };

// {
//     "name":"punit",
//     "email":"punit@mail.com",
//     "password":"12345",
//     "dob":"1998/02/15",
//     "bio":"its my bio"
// }
