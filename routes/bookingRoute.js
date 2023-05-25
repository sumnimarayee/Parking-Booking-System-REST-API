const express = require("express");
const bookingController = require("../controllers/bookingController");
const bookingValidator = require("../validators/bookingValidator");
const manualBookingValidator = require("../validators/manualBookingValidator");
const closeBookingValidator = require("../validators/closeBookingValidator");
const { validateRole } = require("../utils/authenticationHandler");

const router = express.Router();

router.post(
  "/",
  validateRole(["user"]),
  bookingValidator,
  bookingController.createBooking
);
router.post(
  "/manual-booking",
  validateRole(["staff"]),
  manualBookingValidator,
  bookingController.manualBooking
);
router.post(
  "/close-booking",
  validateRole(["staff"]),
  closeBookingValidator,
  bookingController.closeBooking
);

router.get(
  "/user/:userId/",
  validateRole(["user"]),
  bookingController.fetchUserBookings
);
module.exports = router;
