const ParkingLot = require("../models/parkingLotModel");
const User = require("../models/userModel");

exports.fetchAllParkingLot = async () => {
  return await ParkingLot.aggregate([
    {
      $project: {
        _id: 1,
        name: 1,
        longitude: 1,
        latitude: 1,
        bikeParkingCostPerHour: 1,
        carParkingCostPerHour: 1,
        bikeParkingCapacity: 1,
        carParkingCapacity: 1,
        openingTime: 1,
        closingTime: 1,
        location: 1,
      },
    },
  ]);
};

exports.deleteParkingLotById = async (parkingLotId) => {
  try {
    const parkingLotToDelete = await ParkingLot.findOne({ _id: parkingLotId });
    if (parkingLotToDelete == null || parkingLotToDelete === undefined) {
      throw new Error("Parking Lot with provided id does not exist");
    }
    const assisgnedStaffId = parkingLotToDelete.managingStaff;
    await parkingLotToDelete.delete();
    await User.deleteOne({ _id: assisgnedStaffId });
  } catch (err) {
    return {
      type: "error",
      message: err.message,
    };
  }
};

exports.fetchParkingLotById = async (parkingLotId) => {
  try {
    const parkingLot = await ParkingLot.findById(parkingLotId);
    if (parkingLot === null || parkingLot === undefined) {
      throw new Error("Parking Lot with provided id does not exist");
    }
    return parkingLot;
  } catch (err) {
    return {
      type: "error",
      message: err.message,
    };
  }
};
