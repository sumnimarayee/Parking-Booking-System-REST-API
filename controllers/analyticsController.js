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
    const response = await analyticsService.getTotalRevenueData(timePeriod);
    res.status(200).json({
      message: "success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};
