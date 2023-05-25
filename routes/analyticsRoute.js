const express = require("express");
const analyticsContoller = require("../controllers/analyticsController");
const { validateRole } = require("../utils/authenticationHandler");

const router = express.Router();

router.get(
  "/get-revenue-data/:parkingLotId",
  validateRole(["staff"]),
  analyticsContoller.getTotalRevenueData
);
router.get(
  "/get-bookings-data/:parkingLotId",
  validateRole(["staff"]),
  analyticsContoller.getTotalNumberOfBookingsData
);
router.get(
  "/get-perhour-booking-data/:parkingLotId",
  validateRole(["staff"]),
  analyticsContoller.getNumberOfBookingsPerHour
);
router.get(
  "/get-today-data/:parkingLotId",
  validateRole(["staff"]),
  analyticsContoller.getTodaysData
);

module.exports = router;
