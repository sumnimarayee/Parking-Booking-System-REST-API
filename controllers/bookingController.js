const bookingService = require("../services/bookingService");

exports.createBooking = async (req, res, next) => {
  bookingService.createNewBooking(
    req.body.bookedParkingLot,
    req.body.bookingUser,
    req.body.vehicleType,
    req.body.VehiclePlateNo,
    req.body.bookedTime,
    req.body.pinNo
  );
  res.status(200).json({
    message: "Success",
  });
};
