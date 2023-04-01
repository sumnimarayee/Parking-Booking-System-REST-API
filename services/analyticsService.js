const Booking = require("../models/bookingModel");
const ParkingLot = require("../models/parkingLotModel");
const analyticsRepository = require("../repositories/analyticsRepository");

exports.getTotalRevenueData = async (timePeriod, parkingLotId) => {
  const label = [];
  const data = [];
  if (timePeriod === "thisWeek") {
    const response =
      await analyticsRepository.getBookingsForCurrentWeekGroupedByDay(
        parkingLotId
      );
    const currentWeekDates = getWeekDatesToToday();
    currentWeekDates.forEach((date, index) => {
      if (index === 0) label.push("sunday");
      if (index === 1) label.push("monday");
      if (index === 2) label.push("tuesday");
      if (index === 3) label.push("wednesday");
      if (index === 4) label.push("thursday");
      if (index === 5) label.push("friday");
      if (index === 6) label.push("saturday");
      const filteredData = response.filter(
        (bookingForDay) => bookingForDay._id === date
      );
      if (filteredData.length === 0) {
        data.push(0);
      } else if (filteredData.length > 0) {
        let totalRevenueForDay = 0;
        filteredData.forEach((bookingForDay) => {
          bookingForDay.bookings.forEach((booking) => {
            totalRevenueForDay =
              totalRevenueForDay + (booking?.payment?.paymentAmount || 0);
          });
        });
        data.push(totalRevenueForDay.toFixed(2));
      }
    });
  }

  if (timePeriod === "thisMonth") {
    const response =
      await analyticsRepository.getBookingsForCurrentMonthGroupedByWeek(
        parkingLotId
      );
    const currentWeekOfTheMonths = getCurrentWeekOfMonthToToday();
    currentWeekOfTheMonths.forEach((week, index) => {
      label.push(week);
      const filteredData = response.filter((weekData) => week === weekData._id);

      if (filteredData.length === 0) {
        data.push(0);
      } else if (filteredData.length > 0) {
        let totalRevenueForWeek = 0;
        filteredData.forEach((weekData) => {
          weekData.bookings.forEach((booking) => {
            totalRevenueForWeek =
              totalRevenueForWeek + booking?.payment?.paymentAmount;
          });
        });
        data.push(totalRevenueForWeek.toFixed(2));
      }
    });
  }

  return { label, data };
};

function getWeekDatesToToday() {
  const today = new Date();
  const currentDay = today.getDay();
  const sunday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - currentDay
  );
  const weekDates = [];

  for (let d = sunday; d <= today; d.setDate(d.getDate() + 1)) {
    const yyyy = d.getFullYear().toString();
    const mm = (d.getMonth() + 1).toString().padStart(2, "0");
    const dd = d.getDate().toString().padStart(2, "0");
    weekDates.push(`${yyyy}-${mm}-${dd}`);
  }

  return weekDates;
}

function getCurrentWeekOfMonthToToday() {
  const today = new Date();
  const currentWeekOfMonth = Math.ceil(
    (today.getDate() + (today.getDay() + 1)) / 7
  );
  const weekNames = [
    "First Week",
    "Second Week",
    "Third Week",
    "Fourth Week",
    "Fifth Week",
  ];
  return weekNames.slice(0, currentWeekOfMonth);
}

exports.getTotalNumberOfBookingsData = async (filterData, parkingLotId) => {
  const label = ["Two-Wheelers", "Four-Wheelers"];
  const data = [];
  let totalBooking = [];
  if (filterData === "today") {
    const data = await analyticsRepository.getBookingsForToday(parkingLotId);
    totalBooking = [...data];
  } else if (filterData === "thisWeek") {
    const data = await analyticsRepository.getBookingsForCurrentWeek(
      parkingLotId
    );
    totalBooking = [...data];
  } else if (filterData === "thisMonth") {
    const data = await analyticsRepository.getBookingsForCurrentMonth(
      parkingLotId
    );
    totalBooking = [...data];
  }

  if (totalBooking.length === 0) {
    data.push(0, 0);
  } else {
    let twoWheelersBookingCount = 0;
    let fourWheelersBookingCount = 0;
    totalBooking.forEach((booking) => {
      if (booking.vehicleType === "twoWheeler") {
        twoWheelersBookingCount++;
      } else if (booking.vehicleType === "fourWheeler") {
        fourWheelersBookingCount++;
      }
    });
    data.push(twoWheelersBookingCount, fourWheelersBookingCount);
  }
  return { label, data };
};

exports.getNumberOfBookingsPerHour = async (filterData, parkingLotId) => {
  let totalBookings = [];
  if (filterData === "today") {
    totalBookings = await analyticsRepository.getBookingsForToday(parkingLotId);
  } else if (filterData === "thisWeek") {
    totalBookings = await analyticsRepository.getBookingsForCurrentWeek(
      parkingLotId
    );
  } else if (filterData === "thisMonth") {
    totalBookings = await analyticsRepository.getBookingsForCurrentMonth(
      parkingLotId
    );
  }

  const parkingLot = await ParkingLot.findById(parkingLotId);
  const openingTime = parkingLot.openingTime.split(":")[0] + ":00";
  const closingTime =
    parkingLot.closingTime.split(":")[1] === "00"
      ? parkingLot.closingTime
      : parseInt(parkingLot.closingTime.split(":")[0]) + 1 + ":00";

  const [openingHour, openingMinute] = openingTime.split(":").map(Number);
  const [closingHour, closingMinute] = closingTime.split(":").map(Number);

  const hourRanges = {};

  // Loop through the totalBookings and group them by hour range and vehicle type
  for (let hour = openingHour; hour < closingHour; hour++) {
    const hourRange = `${hour}-${hour + 1}`;
    const hourObjects = totalBookings.filter((obj) => {
      const objHour = obj.createdAt.getHours();
      const objMinute = obj.createdAt.getMinutes();
      return (
        (objHour === hour &&
          objMinute >= openingMinute &&
          objHour !== closingHour) ||
        (objHour === closingHour && objMinute < closingMinute)
      );
    });

    hourRanges[hourRange] = {
      twoWheelerCount: hourObjects.filter(
        (obj) => obj.vehicleType === "twoWheeler"
      ).length,
      fourWheelerCount: hourObjects.filter(
        (obj) => obj.vehicleType === "fourWheeler"
      ).length,
    };
  }

  // Create three separate arrays to hold the hour ranges and their respective counts for each vehicle type
  const label = Object.keys(hourRanges);
  const twoWheelerData = Object.values(hourRanges).map(
    ({ twoWheelerCount }) => twoWheelerCount
  );
  const fourWheelerData = Object.values(hourRanges).map(
    ({ fourWheelerCount }) => fourWheelerCount
  );

  return { label, twoWheelerData, fourWheelerData };
};

exports.fetchTodayData = async (parkingLotId) => {
  let totalRevenue = 0;
  let totalBookings = 0;
  const response = await analyticsRepository.getBookingsForToday(parkingLotId);
  response?.forEach((booking) => {
    totalRevenue = totalRevenue + (booking?.payment?.paymentAmount || 0);
    totalBookings++;
  });

  return { totalRevenue: Number(totalRevenue).toFixed(2), totalBookings };
};
