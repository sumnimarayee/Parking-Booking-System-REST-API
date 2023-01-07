const User = require("../models/userModel");

exports.register = (req, res, next) => {
  let user = new User({
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
    gender: req.body.gender,
    vehicleType: req.body.vehicleType,
    vehiclePlateNumber: req.body.vehiclePlateNumber,
  });
  user.save().then((data) => {
    res.json({
      status: 200,
      message: "user registered successfully!",
      data,
    });
  });
};
