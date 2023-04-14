const Rating = require("../models/ratingModel");
const { ObjectId } = require("mongodb");

exports.fetchRatingForUser = async (userId, parkingLotId) => {
  return await Rating.findOne({ parkingLotId, userId });
};

exports.addRatings = async (userId, parkingLotId, body) => {
  let rating = await Rating.findOne({ parkingLotId, userId });
  if (!rating) {
    const newRating = new Rating({
      rating: body.rating,
      review: body.review,
      userId,
      parkingLotId,
    });
    await newRating.save();
  } else {
    rating.rating = body.rating;
    rating.review = body.review;
    await rating.save();
  }
};

exports.fetchAllRatingsForParkingLot = async (parkingLotId) => {
  const ratings = await Rating.aggregate([
    { $match: { parkingLotId: ObjectId(parkingLotId) } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]).exec();
  return ratings;
};

exports.getAverageRatingForParkingLot = async (parkingLotId) => {
  const ratings = await Rating.find({ parkingLotId });
  const totalRatings = ratings.length;
  const sumRatings = ratings.reduce((acc, rating) => acc + rating.rating, 0);
  const avgRating = totalRatings === 0 ? 0 : sumRatings / totalRatings;

  const rounded = Math.round(avgRating * 2) / 2;
  const average = rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
  return {
    average,
    count: totalRatings,
  };
};
