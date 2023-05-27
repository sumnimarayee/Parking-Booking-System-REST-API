const cron = require("node-cron");
const Booking = require("../models/bookingModel");
const User = require("../models/userModel");
const { sendNotification } = require("./notificationHandler");
// cron.schedule("*/10 * * * * *", async () => {
//   const currentTime = Math.floor(Date.now() / 1000);
//   const today = new Date().toISOString().slice(0, 10);

//   const ongoingBookings = await Booking.aggregate([
//     { $match: { bookingStatus: "ongoing" } },
//     { $match: { bookingType: "online" } },
//     {
//       $match: {
//         createdAt: {
//           $gte: new Date(
//             new Date().setHours(0, 0, 0, 0) -
//               new Date().getDay() * 24 * 60 * 60 * 1000
//           ),
//           $lte: new Date(
//             new Date().setHours(23, 59, 59, 999) +
//               (6 - new Date().getDay()) * 24 * 60 * 60 * 1000
//           ),
//         },
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "bookingUser",
//         foreignField: "_id",
//         as: "user",
//       },
//     },
//     { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
//   ]).exec();

//   const rawTokens = ongoingBookings.map((booking) => {
//     const endTime = booking.bookedTime.split("-")[1];
//     const endTimestamp = Math.floor(
//       new Date(`${today} ${endTime}`).getTime() / 1000
//     );

//     if (endTimestamp < currentTime) {
//       return booking.user.notificationToken;
//     }
//   });

//   const cleanTokens = rawTokens.filter(
//     (token) => token !== null && token !== undefined
//   );
//   const uniqueTokens = Array.from(new Set(cleanTokens));

//   uniqueTokens.forEach(async (token) => {
//     await sendNotification(
//       token,
//       "Booking Expired",
//       "Your booking has been expired. You will be charged extra amount when checking out"
//     );
//   });
// });
