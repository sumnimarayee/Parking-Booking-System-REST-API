const ParkingLot = require("../models/parkingLotModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const bookings = require("../models/bookingModel");
const bookingService = require("../services/bookingService");

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.fetchAllParkingLot = async (
  minPrice,
  maxPrice,
  vehicleType,
  isBookingUser,
  isSuperAdmin
) => {
  const query = [];
  if (isBookingUser) {
    query.push({
      $match: {
        updatedItems: {
          bikeParkingCapacity: true,
          carParkingCapacity: true,
          bikeParkingCostPerHour: true,
          carParkingCostPerHour: true,
          openingTime: true,
          closingTime: true,
          name: true,
          location: true,
          password: true,
          imageURLs: true,
        },
      },
    });
  }

  query.push({
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
      imageURLs: 1,
    },
  });

  const numberOnlyRegex = /^[0-9]*$/;
  if (minPrice !== null && minPrice !== undefined) {
    if (numberOnlyRegex.test(minPrice) === false) {
      const error = new Error("minPrice must be a number");
      error.statusCode = 401;
      throw error;
    }
  }
  if (maxPrice !== null && maxPrice !== undefined) {
    if (numberOnlyRegex.test(maxPrice) === false) {
      const error = new Error("maxPrice must be a number");
      error.statusCode = 401;
      throw error;
    }
  }

  if (
    minPrice !== null &&
    minPrice !== undefined &&
    maxPrice !== null &&
    maxPrice !== undefined
  ) {
    if (parseInt(minPrice) > parseInt(maxPrice)) {
      const error = new Error("minPrice must be less than maxPrice");
      error.statusCode = 401;
      throw error;
    }
  }
  if (minPrice) {
    if (maxPrice) {
      if (vehicleType === "twoWheeler") {
        query.push({
          $match: {
            $and: [
              { bikeParkingCostPerHour: { $lte: parseInt(maxPrice) } },
              { bikeParkingCostPerHour: { $gte: parseInt(minPrice) } },
            ],
          },
        });
      } else if (vehicleType === "fourWheeler") {
        query.push({
          $match: {
            $and: [
              { carParkingCostPerHour: { $lte: parseInt(maxPrice) } },
              { carParkingCostPerHour: { $gte: parseInt(minPrice) } },
            ],
          },
        });
      }
    } else if (maxPrice === null || maxPrice === undefined) {
      if (vehicleType === "twoWheeler") {
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
  const parkingLotToDelete = await ParkingLot.findOne({ _id: parkingLotId });
  if (parkingLotToDelete == null || parkingLotToDelete === undefined) {
    const error = new Error("Parking Lot with provided id does not exist");
    error.statusCode = 401;
    throw error;
  }
  const assisgnedStaffId = parkingLotToDelete.managingStaff;
  await parkingLotToDelete.delete();
  await User.deleteOne({ _id: assisgnedStaffId });
};

exports.fetchParkingLotById = async (parkingLotId) => {
  const parkingLot = await ParkingLot.findById(parkingLotId);
  if (parkingLot === null || parkingLot === undefined) {
    const error = new Error("Parking Lot with provided id does not exist");
    error.statusCode = 401;
    throw error;
  }
  return parkingLot;
};

exports.createNewParkingLot = async (
  email,
  name,
  longitude,
  latitude,
  location
) => {
  await bcrypt.hash("password", 10, async function (err, hashed) {
    if (err) {
      throw new Error(err.message);
    }
    let managingStaff = new User({
      name: "staff",
      email: email,
      password: hashed,
      contactNo: "",
      gender: " ",
      vehicleType: " ",
      isStaff: true,
      isBookingUser: false,
      isSuperAdmin: false,
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
      updatedItems: {
        bikeParkingCapacity: false,
        carParkingCapacity: false,
        bikeParkingCostPerHour: false,
        carParkingCostPerHour: false,
        openingTime: false,
        closingTime: false,
        name: true,
        location: true,
        password: false,
        imageURLs: false,
      },
    });
    await parkingLot.save();
  });
};

//future => change position(lat lng)
exports.updateParkingLot = async (data, parkingLotId) => {
  const parkingLotToUpdate = await ParkingLot.findById(parkingLotId);
  const toUpdateItems = { ...parkingLotToUpdate.updatedItems };

  if (data.name) {
    parkingLotToUpdate.name = data.name;
  }

  if (data.location) {
    parkingLotToUpdate.location = data.location;
  }

  if (data.imageURLs) {
    parkingLotToUpdate.imageURLs = data.imageURLs;
    if (data.imageURLs.length >= 3) toUpdateItems.imageURLs = true;
  }

  if (data.bikeParkingCapacity) {
    parkingLotToUpdate.bikeParkingCapacity = data.bikeParkingCapacity;
    toUpdateItems.bikeParkingCapacity = true;
  }

  if (data.carParkingCapacity) {
    parkingLotToUpdate.carParkingCapacity = data.carParkingCapacity;
    toUpdateItems.carParkingCapacity = true;
  }

  if (data.bikeParkingCostPerHour) {
    parkingLotToUpdate.bikeParkingCostPerHour = data.bikeParkingCostPerHour;
    toUpdateItems.bikeParkingCostPerHour = true;
  }

  if (data.carParkingCostPerHour) {
    parkingLotToUpdate.carParkingCostPerHour = data.carParkingCostPerHour;
    toUpdateItems.carParkingCostPerHour = true;
  }

  if (data.openingTime) {
    parkingLotToUpdate.openingTime = data.openingTime;
    toUpdateItems.openingTime = true;
  }

  if (data.closingTime) {
    parkingLotToUpdate.closingTime = data.closingTime;
    toUpdateItems.closingTime = true;
  }
  if (data.contactNO) {
    parkingLotToUpdate.contactNO = data.contactNO;
  }
  parkingLotToUpdate.updatedItems = { ...toUpdateItems };
  // parkingLotToUpdate.updatedByStaff = true;

  await parkingLotToUpdate.save();
  return parkingLotToUpdate;
};

exports.fetchByStaffId = async (staffId, filters) => {
  const data = {};
  const parkingLot = await ParkingLot.findOne({
    managingStaff: staffId,
  }).exec();
  if (!parkingLot) {
    const error = new Error("Parking Lot does not exist");
    error.statusCode = 401;
    throw error;
  }
  data.parkingLot = parkingLot;

  const bookings = await bookingService.getDashboardBooking(parkingLot._id);

  data.bookings = [...bookings];

  return data;
};
