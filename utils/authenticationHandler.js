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
    jwt.verify(token, "thesecrettoken", async (err, userId) => {
      if (err) {
        res.status(403).send("Token invalid");
      } else {
        userId = userId.id;
        const loggingInUser = await User.findById(userId);
        req.user = loggingInUser;
        next(); //proceed to the next action in the calling function
      }
    }); //end of jwt.verify()
  }
}; //end of function
