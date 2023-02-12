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

exports.createNewParkingLot = async (
  email,
  name,
  longitude,
  latitude,
  location
) => {
  try {
    let managingStaff = new User({
      name: "staff",
      email: email,
      password: "password",
      contactNo: "",
      gender: " ",
      vehicleType: " ",
      isStaff: true,
      isBookingUser: false,
    });
    const createdStaff = await managingStaff.save();
    let parkingLot = new ParkingLot({
      name: name,
      longitude: longitude,
      latitude: latitude,
      location: location,
      managingStaff: createdStaff._id,
      bikeParkingCapacity: 0,
      carParkingCapacity: 0,
      bikeParkingCostPerHour: 0,
      carParkingCostPerHour: 0,
      openingTime: "9:00",
      closingTime: "17:00",
      twoWheelerBookedSlots: [],
      fourWheelerBookedSlots: [],
    });
    await parkingLot.save();
    return "";
  } catch (err) {
    return {
      type: "Error",
      message: err.message,
    };
  }
};
