const ParkingLot = require("../models/parkingLotModel");

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
      },
    },
  ]);
};
