const express = require("express");
const ratingController = require("../controllers/ratingController");
const insertRatingValidator = require("../validators/insertRatingValidator");
const { validateRole } = require("../utils/authenticationHandler");
const router = express.Router();

router.get(
  "/user/:id",
  validateRole(["staff", "user"]),
  ratingController.fetchRatingForUser
);
router.post(
  "/user/:id",
  validateRole(["user"]),
  insertRatingValidator,
  ratingController.addRatingForUser
);
router.get(
  "/average-rating/:id",
  validateRole(["staff", "user"]),
  ratingController.getAverageRatingForParkingLot
);
router.get(
  "/:id",
  validateRole(["user", "staff"]),
  ratingController.getAllParkingLotRatings
);

module.exports = router;
