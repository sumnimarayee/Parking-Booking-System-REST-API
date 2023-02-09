const superAdminService = require("../services/superAdmin");
const parkingLotService = require("../services/parkingLot");
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

exports.fetchAllParkingLots = async (req, res, next) => {
  try {
    const data = await parkingLotService.fetchAllParkingLot();
    res.status(200).json({
      message: "success",
      data,
    });
  } catch (err) {
    next(err);
  }
};
