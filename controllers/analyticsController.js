const analyticsService = require("../services/analyticsService");

exports.getTodayAnalyticsData = (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
exports.getTotalRevenueData = async (req, res, next) => {
  try {
    const { timePeriod } = req.query;
    const { parkingLotId } = req.params;
    const response = await analyticsService.getTotalRevenueData(
      timePeriod,
      parkingLotId
    );
    res.status(200).json({
      message: "success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

exports.getTotalNumberOfBookingsData = async (req, res, next) => {
  try {
    const { timePeriod } = req.query;
    const { parkingLotId } = req.params;
    const response = await analyticsService.getTotalNumberOfBookingsData(
      timePeriod,
      parkingLotId
    );
    res.status(200).json({
      message: "success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

exports.getNumberOfBookingsPerHour = async (req, res, next) => {
  try {
    const { timePeriod } = req.query;
    const { parkingLotId } = req.params;
    const response = await analyticsService.getNumberOfBookingsPerHour(
      timePeriod,
      parkingLotId
    );
    res.status(200).json({
      message: "success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

exports.getTodaysData = async (req, res, next) => {
  try {
    const { parkingLotId } = req.params;
    const response = await analyticsService.fetchTodayData(parkingLotId);
    res.status(200).json({
      message: "success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};
