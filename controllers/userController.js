const User = require("../models/userModel");
// const esewaService = require("../services/esewaService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = (req, res, next) => {
  try {
    //TODO what is 10?
    bcrypt.hash(req.body.password, 10, function (err, hashed) {
      if (err) {
        throw new Error(err.message);
      }
      let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashed,
        contactNo: req.body.contactNo,
        gender: req.body.gender,
        vehicleType: req.body.vehicleType,
      });
      user.save().then((data) => {
        res.json({
          status: 200,
          message: "user registered successfully!",
          data,
        });
      });
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    var email = req.body.email;
    var password = req.body.password;

    const user = await User.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, function (err, ismatch) {
        if (err) {
          next(new Error(err.message));
        }
        if (ismatch) {
          let token = jwt.sign({ id: user._id }, "thesecrettoken", {
            expiresIn: "10min",
          });
          let refreshToken = jwt.sign({ id: user._id }, "thesecrettoken", {
            expiresIn: "20min",
          });
          res.json({
            message: "Login successful!",
            token,
            refreshToken,
            userRole: {
              isBookingUser: user.isBookingUser,
              isStaff: user.isStaff,
              isSuperAdmin: user.isSuperAdmin,
            },
          });
        } else {
          const error = new Error("Invalid Password");
          error.statusCode = 401;
          next(error);
        }
      });
    } else {
      const error = new Error("No user found");
      error.statusCode = 404;
      throw error;
    }
  } catch (err) {
    next(err);
  }
};
