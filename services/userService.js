const User = require("../models/userModel");
const parkingLotService = require("../services/parkingLotService");

exports.updateBookingUserPassword = (userId, password) => {
  bcrypt.hash(req.body.password, 10, async function (err, hashed) {
    if (err) {
      throw new Error(err.message);
    }
    const userToUpdate = User.findById(userId);
    userToUpdate.password = hashed;
    await userToUpdate.update();
  });
};

exports.updateStaffPassword = (staffId, password) => {
  bcrypt.hash(req.body.password, 10, async function (err, hashed) {
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
