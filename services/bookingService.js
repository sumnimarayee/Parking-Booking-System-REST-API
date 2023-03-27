const Booking = require("../models/bookingModel");
const ParkingLot = require("../models/parkingLotModel");
const parkingLotService = require("../services/parkingLotService");
const Payment = require("../models/paymentModel");

exports.createNewBooking = async (
  bookedParkingLot,
  bookingUser,
  vehicleType,
  vehiclePlateNo,
  bookedTime,
  pinoNO
) => {
  // Check time to validate if the request is made 30 mins before the parking lot opening time and 1.5 hours before closing time.
  const parkingLot = await parkingLotService.fetchParkingLotById(
    bookedParkingLot
  );

  const time = new Date();
  const currentTime = `${time.getHours()}.${time.getMinutes()}`;
  const parkingLotOpeningTime = parkingLot.openingTime.split(":"); // using String fuction which is split.
  const openingTime = parkingLotOpeningTime[0] + "." + parkingLotOpeningTime[1];
  const validTimeAfterHour = (openingTime - "0.30").toString().split(".")[0];
  let validTimeAfterMinute = 0;
  const substractedMinuteForOpeningTime = parkingLotOpeningTime[1] - 30;
  substractedMinuteForOpeningTime < 0
    ? (validTimeAfterMinute = substractedMinuteForOpeningTime + 60)
    : (validTimeAfterMinute = substractedMinuteForOpeningTime);
  validTimeAfterMinute =
    validTimeAfterMinute <= 9
      ? "0" + validTimeAfterMinute
      : validTimeAfterMinute;
  const validTimeAfter = `${validTimeAfterHour}.${validTimeAfterMinute}`;

  const parkingLotClosingTime = parkingLot.closingTime.split(":");
  const closingTime = parkingLotClosingTime[0] + "." + parkingLotClosingTime[1];
  const validTimeBeforeHour = (closingTime - "1.30").toString().split(".")[0];
  let validTimeBeforeMinute = 0;
  const substractedMinuteForClosingTime = parkingLotClosingTime[1] - 30;
  substractedMinuteForClosingTime < 0
    ? (validTimeBeforeMinute = substractedMinuteForClosingTime + 60)
    : (validTimeBeforeMinute = substractedMinuteForClosingTime);
  validTimeBeforeMinute =
    validTimeBeforeMinute <= 9
      ? "0" + validTimeBeforeMinute
      : validTimeBeforeMinute;
  const validTimeBefore = `${validTimeBeforeHour}.${validTimeBeforeMinute}`;

  if (currentTime - validTimeAfter < 0 || currentTime - validTimeBefore > 0) {
    const error = new Error("Cannot request booking in this hour");
    error.statusCode = 401;
    throw error;
  }

  const assignedSlot = checkAndAssignSlots(parkingLot, vehicleType);

  // Calculate the amount to be deducted
  const bookTime = bookedTime.split("-");
  const startTime = bookTime[0].split(":").join(".");
  const endTime = bookTime[1].split(":").join(".");
  const estimatedBookedHour = endTime - startTime;
  let estimatedBookedMinute = endTime.split(".")[1] - startTime.split(".")[1];
  estimatedBookedMinute < 0 ? (estimatedBookedMinute += 60) : "";
  const totalBookingTime =
    estimatedBookedHour.toString().split(".")[0] + "." + estimatedBookedMinute;
  let totalAmount = 0;
  if (vehicleType === "twoWheeler") {
    totalAmount =
      estimatedBookedHour.toString().split(".")[0] *
        parkingLot.bikeParkingCostPerHour +
      (parkingLot.bikeParkingCostPerHour / 60) * estimatedBookedMinute;
  } else if (vehicleType === "fourWheeler") {
    totalAmount =
      estimatedBookedHour.toString().split(".")[0] *
        parkingLot.carParkingCostPerHour +
      (parkingLot.carParkingCostPerHour / 60) * estimatedBookedMinute;
  }

  //update the parking lot
  parkingLot.save();

  // booking object is created
  let booking = new Booking({
    bookedParkingLot,
    bookingUser,
    vehicleType,
    vehiclePlateNo,
    bookedTime,
    bookingStatus: "ongoing",
    bookingType: "online",
    assignedSlot,
  });
  const savedBooking = await booking.save();

  //payment object is created
  let payment = new Payment({
    bookingId: savedBooking._id,
    paymentAmount: totalAmount,
  });
  const savedPayment = await payment.save();
};

const checkAndAssignSlots = (parkingLot, vehicleType) => {
  // check if the slot is available for the request
  let assignedSlot = 0;
  if (vehicleType == "twoWheeler") {
    if (
      parkingLot.twoWheelerBookedSlots.length === parkingLot.bikeParkingCapacity
    ) {
      const error = new Error("Slot is not available");
      error.statusCode = 401;
      throw error;
    }
    // find the next slot to book for the request in the array of slot and add it to array.
    if (parkingLot.twoWheelerBookedSlots.length === 0) {
      parkingLot.twoWheelerBookedSlots.push(1);
      assignedSlot = 1;
    } else {
      let pushAtLast = true;
      for (let i = 0; i <= parkingLot.twoWheelerBookedSlots.length - 1; i++) {
        const value = parkingLot.twoWheelerBookedSlots[i];
        if (i !== value - 1) {
          parkingLot.twoWheelerBookedSlots.splice(i, 0, i + 1);
          pushAtLast = false;
          assignedSlot = i + 1;
          break;
        }
      }
      if (pushAtLast) {
        parkingLot.twoWheelerBookedSlots.push(
          parkingLot.twoWheelerBookedSlots.length + 1
        );
        assignedSlot = parkingLot.twoWheelerBookedSlots.length + 1;
      }
    }
  }

  if (vehicleType == "fourWheeler") {
    if (
      parkingLot.fourWheelerBookedSlots.length === parkingLot.carParkingCapacity
    ) {
      const error = new Error("Slot is not available");
      error.statusCode = 401;
      throw error;
    }
    // find the next slot to book for the request in the array of slot and add it to array.
    if (parkingLot.fourWheelerBookedSlots.length === 0) {
      parkingLot.fourWheelerBookedSlots.push(1);
      assignedSlot = 1;
    } else {
      let pushAtLast = true;
      for (let i = 0; i <= parkingLot.fourWheelerBookedSlots.length - 1; i++) {
        const value = parkingLot.twoWheelerBookedSlots[i];
        if (i !== value - 1) {
          parkingLot.fourWheelerBookedSlots.splice(i, 0, i + 1);
          pushAtLast = false;
          assignedSlot = i + 1;
          break;
        }
      }
      if (pushAtLast) {
        parkingLot.fourWheelerBookedSlots.push(
          parkingLot.fourWheelerBookedSlots.length + 1
        );
        assignedSlot = parkingLot.fourWheelerBookedSlots.length + 1;
      }
    }
  }

  return assignedSlot;
};

exports.createManualBooking = async (
  bookedParkingLot,
  vehicleType,
  vehiclePlateNo,
  bookingStartTime
) => {
  bookedTime = bookingStartTime + "-";

  const parkingLot = await parkingLotService.fetchParkingLotById(
    bookedParkingLot
  );

  const time = new Date();

  const assignedSlot = checkAndAssignSlots(parkingLot, vehicleType);

  let booking = new Booking({
    bookedParkingLot,
    vehicleType,
    vehiclePlateNo,
    bookedTime,
    bookingStatus: "ongoing",
    bookingType: "offline",
    assignedSlot,
  });
  const savedBooking = await booking.save();
};

exports.getDashboardBooking = async (parkingLotId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const filter = [
    {
      $match: {
        createdAt: { $gte: today },
      },
    },
    { $match: { bookedParkingLot: parkingLotId } },
    {
      $lookup: {
        from: "users",
        localField: "bookingUser",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
  ];

  const totalBooking = await Booking.aggregate(filter).exec();
  return totalBooking;
};
