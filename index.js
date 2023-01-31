const express = require("express");

const authRoutes = require("./routes/authenticationRoute");
const superAdminRoutes = require("./routes/superAdminRoute");

const router = express.Router();
router.use(authRoutes);
router.use("/super-admin", superAdminRoutes);
module.exports = router;
