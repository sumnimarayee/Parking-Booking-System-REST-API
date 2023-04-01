const Booking = require("../models/bookingModel");
const { ObjectId } = require("mongodb");

exports.getBookingsForCurrentWeekGroupedByDay = async (parkingLotId) => {
  return await Booking.aggregate([
    {
      $match: {
        bookedParkingLot: ObjectId(parkingLotId),
      },
    },
    {
      $match: {
        createdAt: {
          $gte: new Date(
            new Date().setHours(0, 0, 0, 0) -
              new Date().getDay() * 24 * 60 * 60 * 1000
          ),
          $lte: new Date(
            new Date().setHours(23, 59, 59, 999) +
              (6 - new Date().getDay()) * 24 * 60 * 60 * 1000
          ),
        },
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
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        bookings: {
          $push: "$$ROOT",
        },
      },
    },
  ]);
};
// 641c4ad5f19971a6462bf2f3
exports.getBookingsForCurrentMonthGroupedByWeek = async (parkingLotId) => {
  return await Booking.aggregate([
    {
      $match: {
        bookedParkingLot: ObjectId(parkingLotId),
      },
    },
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          $lte: new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            0
          ),
        },
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
      $project: {
        weekOfMonth: {
          $subtract: [
            {
              $week: "$createdAt",
            },
            {
              $week: {
                $dateFromParts: {
                  year: {
                    $year: "$createdAt",
                  },
                  month: {
                    $month: "$createdAt",
                  },
                  day: 1,
                },
              },
            },
          ],
        },
        booking: "$$ROOT",
      },
    },
    {
      $group: {
        _id: "$weekOfMonth",
        bookings: {
          $push: "$booking",
        },
      },
    },
    {
      $set: {
        _id: {
          $switch: {
            branches: [
              {
                case: {
                  $eq: ["$_id", 0],
                },
                then: "First Week",
              },
              {
                case: {
                  $eq: ["$_id", 1],
                },
                then: "Second Week",
              },
              {
                case: {
                  $eq: ["$_id", 2],
                },
                then: "Third Week",
              },
              {
                case: {
                  $eq: ["$_id", 3],
                },
                then: "Fourth Week",
              },
              {
                case: {
                  $eq: ["$_id", 4],
                },
                then: "Fifth Week",
              },
            ],
            default: "Unknown Week",
          },
        },
      },
    },
  ]);
};

exports.getBookingsForCurrentWeek = async (parkingLotId) => {
  return await Booking.aggregate([
    {
      $match: {
        bookedParkingLot: ObjectId(parkingLotId),
      },
    },
    {
      $match: {
        createdAt: {
          $gte: new Date(
            new Date().setHours(0, 0, 0, 0) -
              new Date().getDay() * 24 * 60 * 60 * 1000
          ),
          $lte: new Date(
            new Date().setHours(23, 59, 59, 999) +
              (6 - new Date().getDay()) * 24 * 60 * 60 * 1000
          ),
        },
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
  ]);
};

exports.getBookingsForCurrentMonth = async (parkingLotId) => {
  return await Booking.aggregate([
    {
      $match: {
        bookedParkingLot: ObjectId(parkingLotId),
      },
    },
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          $lte: new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            0
          ),
        },
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
  ]);
};

exports.getBookingsForToday = async (parkingLotId) => {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  return await Booking.aggregate([
    {
      $match: {
        bookedParkingLot: ObjectId(parkingLotId),
      },
    },
    {
      $match: {
        createdAt: { $gte: today },
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
  ]);
};
