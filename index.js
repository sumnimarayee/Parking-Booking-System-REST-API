const express = require("express");

const authRoutes = require("./routes/authenticationRoute");
const superAdminRoutes = require("./routes/superAdminRoute");
const parkingLotRoutes = require("./routes/ParkingLotRoute");

const router = express.Router();
router.use(authRoutes);
router.use("/super-admin", superAdminRoutes);
router.use("/parking-lot", parkingLotRoutes);
module.exports = router;
