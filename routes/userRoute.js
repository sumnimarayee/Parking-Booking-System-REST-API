const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.get("/parkinglots", userController.getAllParkingLots);

module.exports = router;
