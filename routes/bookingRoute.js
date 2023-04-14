const express = require("express");
const bookingController = require("../controllers/bookingController");
const bookingValidator = require("../validators/bookingValidator");
const manualBookingValidator = require("../validators/manualBookingValidator");
const closeBookingValidator = require("../validators/closeBookingValidator");

const router = express.Router();

router.post("/", bookingValidator, bookingController.createBooking);
router.post(
  "/manual-booking",
  manualBookingValidator,
  bookingController.manualBooking
);
router.post(
  "/close-booking",
  closeBookingValidator,
  bookingController.closeBooking
);

router.get("/user/:userId/", bookingController.fetchUserBookings);
module.exports = router;
