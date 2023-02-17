const express = require("express");

const authRoutes = require("./routes/authenticationRoute");
const superAdminRoutes = require("./routes/superAdminRoute");
const parkingLotRoutes = require("./routes/ParkingLotRoute");
const bookingRoutes = require("./routes/bookingRoute");
const esewaRoutes = require("./routes/esewaRoute");
const app = require("./app");

const router = express.Router();
router.use("/parking-lot", parkingLotRoutes);
router.use("/booking", bookingRoutes);
router.use("/esewa", esewaRoutes);
module.exports = router;
