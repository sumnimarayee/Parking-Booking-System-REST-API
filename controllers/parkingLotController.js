const parkingLotService = require("../services/parkingLot");

exports.getAllParkingLots = async (req, res, next) => {
  try {
    const parkingLots = await parkingLotService.fetchAllParkingLot();
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
    res.status(200).json({ message: success });
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
