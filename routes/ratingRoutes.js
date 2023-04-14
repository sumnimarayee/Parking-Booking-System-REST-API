const express = require("express");
const ratingController = require("../controllers/ratingController");
const insertRatingValidator = require("../validators/insertRatingValidator");
const router = express.Router();

router.get("/user/:id", ratingController.fetchRatingForUser);
router.post(
  "/user/:id",
  insertRatingValidator,
  ratingController.addRatingForUser
);
router.get(
  "/average-rating/:id",
  ratingController.getAverageRatingForParkingLot
);
router.get("/:id", ratingController.getAllParkingLotRatings);

module.exports = router;
