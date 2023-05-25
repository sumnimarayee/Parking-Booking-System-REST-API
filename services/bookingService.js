const Booking = require("../models/bookingModel");
const ParkingLot = require("../models/parkingLotModel");
const parkingLotService = require("../services/parkingLotService");
const Payment = require("../models/paymentModel");
const paymentService = require("../services/paymentService");
const bookingRepository = require("../repositories/bookingsRepository");
const { ObjectId } = require("mongodb");

const moment = require("moment");
const User = require("../models/userModel");
const { sendNotification } = require("../utils/notificationHandler");

const bookingTimeValidation = (
  openingTime,
  closingTime,
  startTime,
  endTime
) => {
  // Convert all times to minutes
  const openingTimeInMinutes = getMinutesFromTime(openingTime);
  const closingTimeInMinutes = getMinutesFromTime(closingTime);
  const startTimeInMinutes = getMinutesFromTime(startTime);
  const endTimeInMinutes = getMinutesFromTime(endTime);
  const currentTimeInMinutes = getMinutesFromTime(moment().format("HH:mm"));

  if (
    startTimeInMinutes < openingTimeInMinutes ||
    endTimeInMinutes > closingTimeInMinutes ||
    endTimeInMinutes < openingTimeInMinutes ||
    startTimeInMinutes > closingTimeInMinutes
  ) {
    const error = new Error("Cannot request booking outside parking lot hours");
    error.statusCode = 401;
    throw error;
  }

  if (startTimeInMinutes > endTimeInMinutes) {
    const error = new Error("Start Time must be less than end time");
    error.statusCode = 401;
    throw error;
  }
  if (startTimeInMinutes > endTimeInMinutes - 30) {
    const error = new Error("Booking must be made for minumum of 30 minutes");
    error.statusCode = 401;
    throw error;
  }
  if (
    startTimeInMinutes < currentTimeInMinutes ||
    endTimeInMinutes < currentTimeInMinutes
  ) {
    const error = new Error("Booking cannot be made for past");
    error.statusCode = 401;
    throw error;
  }
};

const getMinutesFromTime = (time) => {
  const [hours, minutes] = time.split(":");
  return parseInt(hours) * 60 + parseInt(minutes);
};

exports.createNewBooking = async (
  bookedParkingLot,
  bookingUser,
  vehicleType,
  vehiclePlateNo,
  bookedTime
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
  bookingTimeValidation(
    parkingLot.openingTime,
    parkingLot.closingTime,
    bookTime[0],
    bookTime[1]
  );
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
      (parkingLot.bikeParkingCostPerHour / 60) *
        estimatedBookedMinute.toFixed(2);
  } else if (vehicleType === "fourWheeler") {
    totalAmount =
      estimatedBookedHour.toString().split(".")[0] *
        parkingLot.carParkingCostPerHour +
      (parkingLot.carParkingCostPerHour / 60) *
        estimatedBookedMinute.toFixed(2);
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

  console.log("fjnkwjen");
  console.log(parkingLot.managingStaff);
  const staff = await User.findById(parkingLot.managingStaff);
  console.log(staff);
  const token = staff.notificationToken;
  console.log(token);
  console.log("fkjnwkf");
  await sendNotification(
    token,
    "New Booking",
    `${vehicleType} Boooking made for ${bookedTime}. Slot assigned is ${assignedSlot}`
  );

  return booking;
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
        assignedSlot = parkingLot.twoWheelerBookedSlots.length;
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
  vehiclePlateNo
) => {
  bookedTime = moment().format("HH:mm") + "- xx:xx";

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
  await parkingLot.save();
  const savedBooking = await booking.save();

  return savedBooking;
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
    { $match: { bookedParkingLot: ObjectId(parkingLotId) } },
    {
      $lookup: {
        from: "users",
        localField: "bookingUser",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
    },
  ];

  const totalBooking = await Booking.aggregate(filter).exec();
  return totalBooking;
};

exports.closeBooking = async (bookingId, bookedParkingLot) => {
  const data = {};
  const booking = await Booking.findById(bookingId);
  const parkingLot = await ParkingLot.findById(bookedParkingLot);
  if (!booking) {
    const error = new Error("Booking data with provided id is not available");
    error.statusCode = 401;
    throw error;
  }
  if (!booking) {
    const error = new Error("Parking Lot with provided id is not available");
    error.statusCode = 401;
    throw error;
  }

  const assignedSlot = booking.assignedSlot;
  const currentTime = moment().format("HH:mm");
  const currentTimeInMinutes = getMinutesFromTime(currentTime);
  if (booking.bookingType === "online") {
    const bookEndTime = booking.bookedTime.split("-")[1];
    const bookEndTimeInMinutes = getMinutesFromTime(bookEndTime);
    let extraAmountToBePaid = 0;
    if (currentTimeInMinutes > bookEndTimeInMinutes + 5) {
      booking.bookedTime = booking.bookedTime.split("-")[0] + "-" + currentTime;
      extraAmountToBePaid = computeTotalAmountFromMinutes(
        currentTimeInMinutes - bookEndTimeInMinutes,
        booking.vehicleType,
        parkingLot
      );
    }
    if (extraAmountToBePaid > 0) {
      await paymentService.updatePaymentForAdditionalDuration(
        bookingId,
        extraAmountToBePaid
      );
    }
    booking.bookingStatus = "completed";
    await booking.save();
    data.bookingType = "online";
    data.extraAmountToBePaid = extraAmountToBePaid;
  }
  if (booking.bookingType === "offline") {
    const bookStartTime = booking.bookedTime.split("-")[0];
    const bookStartTimeInMinutes = getMinutesFromTime(bookStartTime);
    const totalMinutes = currentTimeInMinutes - bookStartTimeInMinutes;
    const totalAmount = computeTotalAmountFromMinutes(
      totalMinutes,
      booking.vehicleType,
      parkingLot
    );
    await paymentService.addNewPaymentForManualBooking(bookingId, totalAmount);
    booking.bookedTime = booking.bookedTime.split("-")[0] + "-" + currentTime;
    booking.bookingStatus = "completed";
    await booking.save();
    data.bookingType = "offline";
    data.totalAmountToBePaid = totalAmount;
  }

  if (booking.vehicleType === "fourWheeler") {
    const slotsArray = parkingLot.fourWheelerBookedSlots;

    var index = slotsArray.indexOf(assignedSlot);
    if (index !== -1) {
      slotsArray.splice(index, 1);
    }
    parkingLot.fourWheelerBookedSlots = [...slotsArray];
  } else if (booking.vehicleType === "twoWheeler") {
    const slotsArray = parkingLot.twoWheelerBookedSlots;

    var index = slotsArray.indexOf(assignedSlot);
    if (index !== -1) {
      slotsArray.splice(index, 1);
    }
    parkingLot.twoWheelerBookedSlots = [...slotsArray];
  }

  parkingLot.save();

  return data;
};

const computeTotalAmountFromMinutes = (minutes, vehicleType, parkingLot) => {
  let pricePerHour = 0;
  if (vehicleType === "fourWheeler") {
    pricePerHour = parkingLot.carParkingCostPerHour;
  } else if (vehicleType === "twoWheeler") {
    pricePerHour = parkingLot.bikeParkingCostPerHour;
  }

  const pricePerMinute = pricePerHour / 60;
  return Number(pricePerMinute * minutes).toFixed(2);
};

exports.fetchBookingsForUser = async (userId, timePeriod) => {
  let bookings = [];
  if (timePeriod === "today") {
    bookings = await bookingRepository.fetchTodayBookingsForUser(userId);
  } else if (timePeriod === "total") {
    bookings = await bookingRepository.fetchAllBookingsForUser(userId);
  }

  return { bookings };
};

exports.computeTotalAmountFromMinutes = computeTotalAmountFromMinutes;
exports.bookingTimeValidation = bookingTimeValidation;
exports.getMinutesFromTime = getMinutesFromTime;
