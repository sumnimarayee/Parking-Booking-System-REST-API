const bookingService = require("../services/bookingService");

describe("Booking Time Validation Test", () => {
  test("Should not throw an error", () => {
    expect(() => {
      const openingTime = "07:00";
      const closingTime = "23:30";
      const startTime = "22:50";
      const endTime = "23:20";
      bookingService.bookingTimeValidation(
        openingTime,
        closingTime,
        startTime,
        endTime
      );
    }).not.toThrow();
  });

  test("Should throw an error", () => {
    expect(() => {
      const openingTime = "9:00";
      const closingTime = "19:00";
      const startTime = "14:30";
      const endTime = "13:00";
      bookingService.bookingTimeValidation(
        openingTime,
        closingTime,
        startTime,
        endTime
      );
    }).toThrow();
  });

  test("Should throw an error", () => {
    expect(() => {
      const openingTime = "9:00";
      const closingTime = "19:00";
      const startTime = "17:30";
      const endTime = "20:00";
      bookingService.bookingTimeValidation(
        openingTime,
        closingTime,
        startTime,
        endTime
      );
    }).toThrow();
  });

  test("Should throw an error", () => {
    expect(() => {
      const openingTime = "9:00";
      const closingTime = "19:00";
      const startTime = "08:30";
      const endTime = "11:00";
      bookingService.bookingTimeValidation(
        openingTime,
        closingTime,
        startTime,
        endTime
      );
    }).toThrow();
  });
});

describe("Total amount from minute computation", () => {
  const parkingLot = {
    carParkingCostPerHour: 40,
    bikeParkingCostPerHour: 20,
  };
  test("should provide correct amount", () => {
    const expectedAmount = "6.67";
    const actualAmount = bookingService.computeTotalAmountFromMinutes(
      10,
      "fourWheeler",
      parkingLot
    );

    expect(actualAmount).toBe(expectedAmount);
  });

  test("should provide correct amount", () => {
    const expectedAmount = "20.00";
    const actualAmount = bookingService.computeTotalAmountFromMinutes(
      60,
      "twoWheeler",
      parkingLot
    );

    expect(actualAmount).toBe(expectedAmount);
  });
});

describe("Total minutes from time", () => {
  test("should provide total minutes from given time", () => {
    const expectedAmount = 0;
    const actualAmount = bookingService.getMinutesFromTime("00:00");

    expect(actualAmount).toBe(expectedAmount);
  });

  test("should provide total minutes from given time", () => {
    const expectedAmount = 630;
    const actualAmount = bookingService.getMinutesFromTime("10:30");

    expect(actualAmount).toBe(expectedAmount);
  });
});
