const Booking = require("../models/bookingModel");
const ParkingLot = require("../models/parkingLotModel");
const parkingLotService = require("../services/parkingLotService");
const esewaService = require("../services/esewaService");
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
  const validTimeAfter = `${validTimeAfterHour}.${validTimeAfterMinute}`;

  const parkingLotClosingTime = parkingLot.closingTime.split(":");
  const closingTime = parkingLotClosingTime[0] + "." + parkingLotClosingTime[1];
  const validTimeBeforeHour = (closingTime - "1.30").toString().split(".")[0];
  let validTimeBeforeMinute = 0;
  const substractedMinuteForClosingTime = parkingLotClosingTime[1] - 30;
  substractedMinuteForClosingTime < 0
    ? (validTimeBeforeMinute = substractedMinuteForClosingTime + 60)
    : (validTimeBeforeMinute = substractedMinuteForClosingTime);
  const validTimeBefore = `${validTimeBeforeHour}.${validTimeBeforeMinute}`;

  if (currentTime - validTimeAfter < 0 || currentTime - validTimeBefore > 0) {
    const error = new Error("Cannot request booking in this hour");
    error.statusCode = 401;
    throw error;
  }
  // check if the slot is available for the request
  if (vehicleType == "twoWheeler") {
    if (parkingLot.currentAvailableBikeParkingSlot === 0) {
      const error = new Error("Slot is not available");
      error.statusCode = 401;
      throw error;
    }
    // find the next slot to book for the request in the array of slot and add it to array.
    if (parkingLot.twoWheelerBookedSlots.length === 0) {
      parkingLot.twoWheelerBookedSlots.push(1);
    } else {
      let pushAtLast = true;
      for (let i = 0; i <= parkingLot.twoWheelerBookedSlots.length - 1; i++) {
        const value = parkingLot.twoWheelerBookedSlots[i];
        if (i !== value - 1) {
          parkingLot.twoWheelerBookedSlots.splice(i, 0, i + 1);
          pushAtLast = false;
          break;
        }
      }
      if (pushAtLast) {
        parkingLot.twoWheelerBookedSlots.push(
          parkingLot.twoWheelerBookedSlots.length + 1
        );
      }
    }
    parkingLot.currentAvailableBikeParkingSlot -= 1;
  }

  if (vehicleType == "fourWheeler") {
    if (parkingLot.currentAvailableCarParkingSlot === 0) {
      const error = new Error("Slot is not available");
      error.statusCode = 401;
      throw error;
    }
    // find the next slot to book for the request in the array of slot and add it to array.
    if (parkingLot.fourWheelerBookedSlots.length === 0) {
      parkingLot.fourWheelerBookedSlots.push(1);
    } else {
      let pushAtLast = true;
      for (let i = 0; i <= parkingLot.fourWheelerBookedSlots.length - 1; i++) {
        const value = parkingLot.twoWheelerBookedSlots[i];
        if (i !== value - 1) {
          parkingLot.fourWheelerBookedSlots.splice(i, 0, i + 1);
          pushAtLast = false;
          break;
        }
      }
      if (pushAtLast) {
        parkingLot.fourWheelerBookedSlots.push(
          parkingLot.fourWheelerBookedSlots.length + 1
        );
      }
    }
    parkingLot.currentAvailableCarParkingSlot -= 1;
  }

  // check if the esewa pin for that user is correct
  const esewa = await esewaService.fetchByUserId(bookingUser);
  if (esewa.pinNo != pinoNO) {
    const error = new Error("Esewa pin is incorrect");
    error.statusCode = 401;
    throw error;
  }

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

  // deduct the amount from esewa of that user
  await esewaService.deductBalanceByUserId(bookingUser, totalAmount);

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
  });
  const savedBooking = await booking.save();

  //payment object is created
  let payment = new Payment({
    bookingId: savedBooking._id,
    paymentAmount: totalAmount,
    paymentStatus: 1,
  });
  const savedPayment = await payment.save();
};

exports.createManualBooking = async (
  bookedParkingLot,
  vehicleType,
  vehiclePlateNo,
  bookingStartTime
) => {
  let booking = new Booking({
    bookedParkingLot,
    vehicleType,
    vehiclePlateNo,
    bookingStartTime,
    bookingStatus: "ongoing",
    bookingType: "offline",
  });
  const savedBooking = await booking.save();
};

exports.getDashboardBooking = async (status, bookingType) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const filter = [
    {
      $match: {
        createdAt: { $gte: today },
      },
    },
  ];
  const totalBooking = await Booking.aggregate();
};
