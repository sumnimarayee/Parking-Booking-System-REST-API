const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.validateToken = (req, res, next) => {
  //get token from request header
  const authHeader = req.headers["authorization"]; // req.headers.authorization
  if (authHeader === null || authHeader === undefined) {
    res.status(400).send("Token not present");
  } else {
    const token = authHeader.split(" ")[1];
    //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
    jwt.verify(token, "thesecrettoken", async (err, userData) => {
      if (err) {
        res.status(403).send("Token invalid");
      } else {
        req.user = await User.findById(userData.id);
        next();
      }
    });
  }
};
