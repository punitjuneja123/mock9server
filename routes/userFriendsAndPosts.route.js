const express = require("express");
const friendAndPostRouter = express.Router();
require("dotenv").config();

const { userModel } = require("../models/user.model");

friendAndPostRouter.get("/api/users/:id/friends", async (req, res) => {
  let friends = await userModel.find({ _id: req.params.id });
  friends = friends[0].friends;
  res.send(friends);
});

friendAndPostRouter.post("/api/users/:id/friends", async (req, res) => {
  let friendID = req.params.id;
  let userData = await userModel.find({
    _id: req.body.userID,
  });
  let userFriendRequests = userData[0].friendRequests;
  // friend data
  let friendData = await userModel.find({
    _id: friendID,
  });

  let checkFriend = false;
  let checkStatus = false;
  for (let i = 0; i < userFriendRequests.length; i++) {
    if (userFriendRequests[i].friendID == friendID) {
      checkFriend = true;
      if (userFriendRequests[i].status == "accept") {
        checkStatus = true;
      }
      break;
    }
  }
  if (checkFriend == true && checkStatus == false) {
    res.send("friend request already send");
  } else if (checkFriend == true && checkStatus == true) {
    res.send("already your friend");
  } else {
    //   ****** Adding friends data to user****
    userFriendRequests.push({
      friendID,
      name: friendData[0].name,
      email: friendData[0].email,
      status: "pending",
    });
    await userModel.findByIdAndUpdate(
      { _id: req.body.userID },
      { friendRequests: userFriendRequests }
    );

    //   ***Adding friendRequests to friend data**

    let friendRequests = friendData[0].friendRequests;
    friendRequests.push({
      userID: req.body.userID,
      name: userData[0].name,
      email: userData[0].email,
      status: "pending",
    });
    await userModel.findByIdAndUpdate({ _id: friendID }, { friendRequests });

    res.send("friend request send");
  }
  console.log(checkFriend);
});

friendAndPostRouter.patch(
  "/api/users/:id/friends/:friendId",
  async (req, res) => {
    let status = req.body.status;
    let friendsID = req.params.friendId;
    let userID = req.params.id;
    // console.log(friendsID, userID);
    let userData = await userModel.find({ _id: userID });
    let friendRequests = userData[0].friendRequests;
    let userFriends = userData[0].friends;

    //   friend data
    let friendsData = await userModel.find({ _id: friendsID });
    let friendsFR = friendsData[0].friendRequests;
    let friendsF = friendsData[0].friends;
    if (status == "accept") {
      let newfriendRequests = [];
      for (let i = 0; i < friendRequests.length; i++) {
        if (friendRequests[i].userID !== friendsID) {
          newfriendRequests.push(friendRequests[i]);
        } else {
          friendRequests[i].status = status;
          userFriends.push({
            friendID: friendRequests[i].userID,
            name: friendRequests[i].name,
            email: friendRequests[i].email,
          });
          friendsF.push({
            friendID: userData[0]._id,
            name: userData[0].name,
            email: userData[0].email,
          });
        }
      }
      await userModel.findByIdAndUpdate(
        { _id: userID },
        { friendRequests, friends: userFriends }
      );
      await userModel.findByIdAndUpdate(
        { _id: friendsID },
        { friends: friendsF }
      );
    } else {
      for (let i = 0; i < friendRequests.length; i++) {
        if (friendRequests[i].userID == friendsID) {
          friendRequests[i].status = status;
          break;
        }
      }
      await userModel.findByIdAndUpdate({ _id: userID }, { friendRequests });
    }
    res.send("status updated");
  }
);

module.exports = { friendAndPostRouter };

// status:"accept/reject"
