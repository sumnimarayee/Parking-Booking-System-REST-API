const Booking = require("../models/bookingModel");
const { ObjectId } = require("mongodb");

exports.fetchAllBookingsForUser = async (userId) => {
  return await Booking.aggregate([
    {
      $match: {
        bookingUser: ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "payments",
        localField: "_id",
        foreignField: "bookingId",
        as: "payment",
      },
    },
    {
      $unwind: {
        path: "$payment",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "parkinglots",
        localField: "bookedParkingLot",
        foreignField: "_id",
        as: "parkingLot",
      },
    },
    {
      $unwind: {
        path: "$parkingLot",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);
};
exports.fetchTodayBookingsForUser = async (userId) => {
  return await Booking.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().setHours(00, 00, 00)),
        },
      },
    },
    {
      $match: {
        bookingUser: ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "payments",
        localField: "_id",
        foreignField: "bookingId",
        as: "payment",
      },
    },
    {
      $unwind: {
        path: "$payment",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "parkinglots",
        localField: "bookedParkingLot",
        foreignField: "_id",
        as: "parkingLot",
      },
    },
    {
      $unwind: {
        path: "$parkingLot",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);
};
