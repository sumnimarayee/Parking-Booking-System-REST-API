const ratingService = require("../services/ratingService");
const Rating = require("../models/ratingModel");

exports.fetchRatingForUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const response = await ratingService.fetchRatingForUser(userId, id);
    res.status(200).json({
      message: "Success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

exports.addRatingForUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const response = await ratingService.addRatings(userId, id, req.body);
    res.status(200).json({
      message: "Success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllParkingLotRatings = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await ratingService.fetchAllRatingsForParkingLot(id);
    res.status(200).json({
      message: "Success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAverageRatingForParkingLot = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await ratingService.getAverageRatingForParkingLot(id);
    res.status(200).json({
      message: "Success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};
