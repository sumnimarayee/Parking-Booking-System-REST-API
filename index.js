const express = require("express");

const authRoutes = require("./routes/authenticationRoute");
const superAdminRoutes = require("./routes/superAdminRoute");
const parkingLotRoutes = require("./routes/ParkingLotRoute");
const bookingRoutes = require("./routes/bookingRoute");

const router = express.Router();
router.use(authRoutes);
router.use("/parking-lot", parkingLotRoutes);
router.use("/booking", bookingRoutes);
module.exports = router;
