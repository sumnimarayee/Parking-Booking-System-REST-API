const express = require("express");

const authRoutes = require("./routes/authenticationRoute");
const superAdminRoutes = require("./routes/superAdminRoute");
const userRoutes = require("./routes/userRoute");

const router = express.Router();
router.use(authRoutes);
router.use("/super-admin", superAdminRoutes);
router.use("/user", userRoutes);
module.exports = router;
