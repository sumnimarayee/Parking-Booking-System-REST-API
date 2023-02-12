const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookedParkingLot: {
      type: mongoose.Types.ObjectId,
      required: [true, "A booking must have a booked parking lot"],
    },
    bookingUser: {
      type: mongoose.Types.ObjectId,
      required: [true, "A booking must have a booking user"],
    },
    vehicleType: {
      type: String,
      required: [true, "Vehicle type is required"],
    },
    vehiclePlateNo: {
      type: String,
      required: [true, "A booking must have a vehicle plate no"],
    },
    bookedTime: {
      type: String,
      required: [true, "Booked time is required"],
    },
    bookingExtendedTime: String,
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
