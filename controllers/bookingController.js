const bookingService = require("../services/bookingService");

exports.createBooking = async (req, res, next) => {
  try {
    await bookingService.createNewBooking(
      req.body.bookedParkingLot,
      req.user._id,
      req.body.vehicleType,
      req.body.vehiclePlateNo,
      req.body.bookedTime,
      req.body.pinNo
    );
    res.status(200).json({
      message: "Success",
    });
  } catch (err) {
    next(err);
  }
};
