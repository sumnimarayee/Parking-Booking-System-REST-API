const express = require("express");

const authRoutes = require("./routes/authenticationRoute");
const superAdminRoutes = require("./routes/superAdminRoute");
const parkingLotRoutes = require("./routes/ParkingLotRoute");
const bookingRoutes = require("./routes/bookingRoute");
const analyticsRoute = require("./routes/analyticsRoute");
const userRoute = require("./routes/userRoutes");
const ratingRoute = require("./routes/ratingRoutes");
const app = require("./app");

const router = express.Router();
router.use("/parking-lot", parkingLotRoutes);
router.use("/booking", bookingRoutes);
router.use("/analytics", analyticsRoute);
router.use("/users", userRoute);
router.use("/ratings", ratingRoute);
module.exports = router;
