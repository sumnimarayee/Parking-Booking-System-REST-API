const express = require("express");
const analyticsContoller = require("../controllers/analyticsController");

const router = express.Router();

router.get("/get-today-data");
router.get("/get-revenue-data", analyticsContoller.getTotalRevenueData);
router.get("/get-bookings-data");
router.get("/get-perhour-booking-data");

module.exports = router;
