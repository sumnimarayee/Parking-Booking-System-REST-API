const ParkingLot = require("../models/parkingLotModel");
const superAdminService = require("../services/superAdmin");

exports.createAccount = async (req, res, next) => {
  superAdminService.createNewParkingLot(
    req.body.email,
    req.body.name,
    req.body.longitude,
    req.body.latitude,
    req.body.location
  );
  res.status(200).json({
    message: "Success",
  });
};
