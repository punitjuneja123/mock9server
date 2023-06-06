const jwt = require("jsonwebtoken");
require("dotenv").config();

function auth(req, res, next) {
  let token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.secret, (err, encode) => {
      if (err) {
        res.status(401);
        res.send("please provide correct token");
      } else {
        req.body.userID = encode.userID;
        next();
      }
    });
  } else {
    res.status(400);
    res.send("please provide token");
  }
}

module.exports = { auth };
