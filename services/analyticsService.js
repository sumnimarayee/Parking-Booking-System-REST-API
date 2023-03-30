const Booking = require("../models/bookingModel");
const bookingRepository = require("../repositories/analyticsRepository");

exports.getTotalRevenueData = async (timePeriod) => {
  const label = [];
  const data = [];
  if (timePeriod === "thisWeek") {
    const response =
      await bookingRepository.getBookingsForCurrentWeekGroupedByDay();
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
              totalRevenueForDay + booking?.payment?.paymentAmount;
          });
        });
        data.push(totalRevenueForDay.toFixed(2));
      }
    });
  }

  if (timePeriod === "thisMonth") {
    const response =
      await bookingRepository.getBookingsForCurrentMonthGroupedByWeek();
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
  const daysToSunday = currentDay === 0 ? 0 : 7 - currentDay;
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

function getPastDaysOfWeek() {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date();
  const todayDayOfWeek = today.getDay();
  const pastDaysOfWeek = [];

  for (let i = 0; i <= todayDayOfWeek; i++) {
    pastDaysOfWeek.push(daysOfWeek[i]);
  }

  return pastDaysOfWeek;
}

console.log(getPastDaysOfWeek());
