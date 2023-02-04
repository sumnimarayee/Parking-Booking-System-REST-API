const mongoose = require("mongoose");

const parkingLotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A parking lot must have a name"],
    },
    location: {
      type: String,
      required: [true, "A parking lot must have a location"],
    },
    imageURLs: Array,
    managingStaff: {
      //it holds the user _id.
      type: mongoose.Types.ObjectId,
      required: [true, "A parking lot must have a management staff"],
    },
    bikeParkingCapacity: {
      type: Number,
      required: [true, "A parking lot must have a bikeParkingCapacity"],
    },
    carParkingCapacity: {
      type: Number,
      required: [true, "A parking lot must have a carParkingCapacity"],
    },
    currentAvailableBikeParkingSlot: Number,
    currentAvailableCarParkingSlot: Number,
    bikeParkingCostPerHour: {
      type: Number,
      required: [true, "A parking lot must have a Bike parking cost per hour"],
    },
    carParkingCostPerHour: {
      type: Number,
      required: [true, "A parking lot must have a Car parking cost per hour"],
    },
    openingTime: String,
    closingTime: String,
    contactNO: String,
    latitude: {
      type: String,
      required: [true, "A parking lot must have a latitude"],
    },
    longitude: {
      type: String,
      required: [true, "A parking lot must have a longitude"],
    },
  },
  { timestamps: true }
);

const ParkingLot = mongoose.model("ParkingLot", parkingLotSchema);
module.exports = ParkingLot;
