const User = require("../models/userModel");
const esewaService = require("../services/esewaService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  bcrypt.hash(req.body.password, 10, function (err, hashed) {
    if (err) {
      res.json({
        status: "500",
        message: err,
      });
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
};

exports.login = (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({ email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, function (err, ismatch) {
        if (err) {
          res.json({
            message: err,
          });
        }
        if (ismatch) {
          let token = jwt.sign({ name: user._id }, "thesecrettoken", {
            expiresIn: "10min",
          });
          let refreshToken = jwt.sign({ name: user._id }, "thesecrettoken", {
            expiresIn: "20min",
          });
          res.json({
            message: "Login successful!",
            token,
            refreshToken,
          });
        } else {
          res.json({
            message: "Password does not matched!",
          });
        }
      });
    } else {
      res.json({
        message: "NO user found!",
      });
    }
  });
};
