const User = require("../models/userModel");
const ParkingLot = require("../models/parkingLotModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");

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
        isStaff: false,
        isBookingUser: true,
        isSuperAdmin: false,
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
      bcrypt.compare(password, user.password, async function (err, ismatch) {
        if (err) {
          next(new Error(err.message));
        }
        if (ismatch) {
          let token = jwt.sign({ id: user._id }, "thesecrettoken", {
            expiresIn: "30min",
          });
          let refreshToken = jwt.sign({ id: user._id }, "thesecrettoken", {
            expiresIn: "1d",
          });
          user.refreshToken = refreshToken;
          await user.save();
          res.cookie("jwt", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
          });
          res.json({
            message: "Login successful!",
            token,
            role: {
              isBookingUser: user.isBookingUser,
              isStaff: user.isStaff,
              isSuperAdmin: user.isSuperAdmin,
            },
            id: user._id,
          });
        } else {
          const error = new Error("Invalid Credentials");
          error.statusCode = 401;
          next(error);
        }
      });
    } else {
      const error = new Error("Invalid Credentials");
      error.statusCode = 401;
      throw error;
    }
  } catch (err) {
    next(err);
  }
};

exports.updatePassword = (req, res, next) => {
  try {
    bcrypt.hash(req.body.password, 10, async function (err, hashed) {
      if (err) {
        throw new Error(err.message);
      }

      const user = await User.findById(req.body.id);
      if (user.isStaff) {
        const parkingLot = await ParkingLot.findOne({
          managingStaff: user.id,
        }).exec();
        const toUpdateItems = { ...parkingLot.updatedItems };
        toUpdateItems.password = true;
        parkingLot.updatedItems = { ...toUpdateItems };
        await parkingLot.save();
      }
      user.password = hashed;
      user.save().then(() => {
        res.json({
          status: 200,
          message: "password successfully updated!",
        });
      });
    });
  } catch (err) {
    next(err);
  }
};

exports.refresh = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403); //Forbidden
    // evaluate jwt
    jwt.verify(refreshToken, "thesecrettoken", (err, decoded) => {
      if (err || foundUser._id.toString() !== decoded.id)
        return res.sendStatus(403);
      // const roles = Object.values(foundUser.roles);
      let token = jwt.sign({ id: decoded.id }, "thesecrettoken", {
        expiresIn: "30min",
      });
      // res.json({ roles, accessToken })
      res.json({
        accessToken: token,
        id: foundUser.id,
        role: {
          isBookingUser: foundUser.isBookingUser,
          isStaff: foundUser.isStaff,
          isSuperAdmin: foundUser.isSuperAdmin,
        },
      });
    });
  } catch (err) {
    console.log(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.sendStatus(204);
    }

    // Delete refreshToken in db
    foundUser.refreshToken = "";
    const result = await foundUser.save();

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.sendStatus(204);
  } catch (err) {
    // next(err);
    console.log(err);
  }
};

exports.updateUser = updateUser = async (req, res, next) => {
  try {
    const response = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({
      message: "Success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

exports.addNotificationToken = addNotificationToken = async (
  req,
  res,
  next
) => {
  try {
    console.log(
      "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^adding notification token"
    );
    const { notificationToken } = req.body;
    const response = await userService.updateUser(req.params.id, {
      notificationToken,
    });
    res.status(200).json({
      message: "Success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserData = async (req, res, next) => {
  try {
    const response = await userService.getUserData(req.params.id);
    res.status(200).json({
      message: "Success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};
