const express = require("express");
const analyticsContoller = require("../controllers/analyticsController");

const router = express.Router();

router.get("/get-today-data/:parkingLotId");
router.get(
  "/get-revenue-data/:parkingLotId",
  analyticsContoller.getTotalRevenueData
);
router.get(
  "/get-bookings-data/:parkingLotId",
  analyticsContoller.getTotalNumberOfBookingsData
);
router.get(
  "/get-perhour-booking-data/:parkingLotId",
  analyticsContoller.getNumberOfBookingsPerHour
);
router.get("/get-today-data/:parkingLotId", analyticsContoller.getTodaysData);

module.exports = router;
