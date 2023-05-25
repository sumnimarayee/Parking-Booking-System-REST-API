const User = require("../models/userModel");
const parkingLotService = require("../services/parkingLotService");

const bcrypt = require("bcrypt");

exports.updateBookingUserPassword = (userId, password) => {
  bcrypt.hash(password, 10, async function (err, hashed) {
    if (err) {
      throw new Error(err.message);
    }
    const userToUpdate = await User.findById(userId);
    userToUpdate.password = hashed;
    await userToUpdate.save();
  });
};

exports.updateStaffPassword = (staffId, password) => {
  bcrypt.hash(password, 10, async function (err, hashed) {
    if (err) {
      throw new Error(err.message);
    }
    const staffToUpdate = User.findById(staffId);
    staffToUpdate.password = hashed;
    await staffToUpdate.update();
    const parkingLotToUpdate = await parkingLotService.fetchByStaffId(staffId);
    parkingLotToUpdate.updatedItems.password = true;
    await parkingLotToUpdate.update();
  });
};

exports.updateUser = async (userId, body) => {
  const userToUpdate = await User.findById(userId);
  if (!userToUpdate) {
    const error = new Error(`User with provided id does not exist`);
    error.statusCode = 404;
    throw error;
  }
  if (body.password) {
    await this.updateBookingUserPassword(userId, body.password);
  }

  if (body.name) {
    userToUpdate.name = body.name;
  }

  if (body.email) {
    userToUpdate.email = body.email;
  }

  if (body.gender) {
    userToUpdate.gender = body.gender;
  }

  if (body.contactNumber) {
    userToUpdate.contactNumber = body.contactNumber;
  }

  if (body.plateNumber) {
    userToUpdate.plateNumber = body.plateNumber;
  }

  if (body.vehicleType) {
    userToUpdate.vehicleType = body.vehicleType;
  }

  if (body.profilePictureURL) {
    userToUpdate.profilePictureURL = body.profilePictureURL;
  }

  if (body.notificationToken) {
    userToUpdate.notificationToken = body.notificationToken;
  }
  await userToUpdate.save();

  return userToUpdate;
};

exports.getUserData = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error(`User with provided id does not exist`);
    error.statusCode = 404;
    throw error;
  }
  return user;
};
