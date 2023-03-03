const ParkingLot = require("../models/parkingLotModel");
const User = require("../models/userModel");

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.fetchAllParkingLot = async (minPrice, maxPrice, vehicleType) => {
  //place in repository
  const query = [
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
  ];
  // maxprice only vechicletype = 4wheeler
  if (minPrice) {
    console.log("minprice = " + minPrice);
    if (maxPrice) {
      if (vehicleType === "twoWheeler") {
        query.push({
          $match: {
            bikeParkingCostPerHour: {
              $and: [
                { $gte: parseInt(minPrice) },
                { $lte: parseInt(maxPrice) },
              ],
            },
          },
        });
      } else if (vehicleType === "fourWheeler") {
        query.push({
          $match: {
            carParkingCostPerHour: {
              $and: [
                { $gte: parseInt(minPrice) },
                { $lte: parseInt(maxPrice) },
              ],
            },
          },
        });
      }
    } else if (maxPrice === null || maxPrice === undefined) {
      console.log("no max price");
      if (vehicleType === "twoWheeler") {
        console.log("two wheeler");
        query.push({
          $match: {
            bikeParkingCostPerHour: { $gte: parseInt(minPrice) },
          },
        });
      } else if (vehicleType === "fourWheeler") {
        query.push({
          $match: {
            carParkingCostPerHour: { $gte: parseInt(minPrice) },
          },
        });
      }
    }
  } else if (maxPrice) {
    if (minPrice === null || minPrice === undefined) {
      if (vehicleType === "twoWheeler") {
        query.push({
          $match: {
            bikeParkingCostPerHour: { $lte: parseInt(maxPrice) },
          },
        });
      } else if (vehicleType === "fourWheeler") {
        query.push({
          $match: {
            carParkingCostPerHour: { $lte: parseInt(maxPrice) },
          },
        });
      }
    }
  }

  return await ParkingLot.aggregate(query);
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
      currentAvailableBikeParkingSlot: 0,
      currentAvailableCarParkingSlot: 0,
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
