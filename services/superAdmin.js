const ParkingLot = require("../models/parkingLotModel");
const User = require("../models/userModel");

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
