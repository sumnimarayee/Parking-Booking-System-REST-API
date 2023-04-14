const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "ratings is required "],
    },
    review: {
      type: String,
      required: [true, "review is required "],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "A review must have an associated user"],
    },
    parkingLotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "parkinglots",
      required: [true, "A review must have an associated parking lot"],
    },
  },
  { timestamps: true }
);

const Rating = mongoose.model("Ratings", ratingSchema);
module.exports = Rating;
