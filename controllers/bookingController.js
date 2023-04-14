const bookingService = require("../services/bookingService");

exports.createBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.createNewBooking(
      req.body.bookedParkingLot,
      req.user._id,
      req.body.vehicleType,
      req.body.vehiclePlateNo,
      req.body.bookedTime,
      req.body.bookingStatus
    );
    res.status(200).json({
      message: "Success",
      data: {
        booking,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.manualBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.createManualBooking(
      req.body.bookedParkingLot,
      req.body.vehicleType,
      req.body.vehiclePlateNo
    );
    res.status(200).json({
      message: "Success",
      data: {
        booking,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.closeBooking = async (req, res, next) => {
  try {
    const closeBookingData = await bookingService.closeBooking(
      req.body.bookingId,
      req.body.bookedParkingLot
    );
    res.status(200).json({
      message: "Success",
      data: closeBookingData,
    });
  } catch (err) {
    next(err);
  }
};

exports.fetchUserBookings = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { timePeriod } = req.query;
    const response = await bookingService.fetchBookingsForUser(
      userId,
      timePeriod
    );
    res.status(200).json({
      message: "Success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};
