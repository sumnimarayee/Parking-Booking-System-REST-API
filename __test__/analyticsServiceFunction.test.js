const analyticsService = require("../services/analyticsService");

describe("Should be able to fetch the dates from sunday of the week to the given date", () => {
  test("Fetch datess from sunday to friday", () => {
    const expectedValue = [
      "2023-04-09",
      "2023-04-10",
      "2023-04-11",
      "2023-04-12",
      "2023-04-13",
      "2023-04-14",
    ];
    const toProvideDate = new Date("2023-04-14");
    const actualValue = analyticsService.getWeekDatesToToday(toProvideDate);
    expect(actualValue).toEqual(expectedValue);
  });
});
