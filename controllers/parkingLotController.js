const parkingLotService = require("../services/parkingLotService");

exports.getAllParkingLots = async (req, res, next) => {
  try {
    const { minPrice, maxPrice, vehicleType } = req.query;
    const { isBookingUser, isSuperAdmin } = req.user;
    const parkingLots = await parkingLotService.fetchAllParkingLot(
      minPrice,
      maxPrice,
      vehicleType,
      isBookingUser,
      isSuperAdmin
    );
    res.status(200).json({
      message: "ok",
      data: parkingLots,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteParkingLot = async (req, res, next) => {
  try {
    await parkingLotService.deleteParkingLotById(req.params.id);
    res.status(200).json({ message: "success" });
  } catch (err) {
    next(err);
  }
};

exports.getParkingLotById = async (req, res, next) => {
  try {
    const result = await parkingLotService.fetchParkingLotById(req.params.id);
    res.status(200).json({ message: "success", data: result });
  } catch (err) {
    next(err);
  }
};

exports.createAccount = async (req, res, next) => {
  await parkingLotService.createNewParkingLot(
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

exports.updateParkingLot = async (req, res, next) => {
  try {
    const parkingLotId = req.params.id;
    const data = await parkingLotService.updateParkingLot(
      req.body,
      parkingLotId
    );
    res.status(200).json({
      message: "Success",
      data,
    });
    // res.status(200).json({
    //   message: "Success",
    //   data,
    // });
  } catch (err) {
    next(err);
  }
};

exports.getParkingLotByStaffId = async (req, res, next) => {
  try {
    const staffId = req.params.id;
    const data = await parkingLotService.fetchByStaffId(staffId);
    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (err) {
    next(err);
  }
};
