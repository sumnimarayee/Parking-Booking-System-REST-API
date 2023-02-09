const express = require("express");
const parkingLotController = require("../controllers/parkingLotController");
const router = express.Router();

router.get("/", parkingLotController.getAllParkingLots);
router.delete("/:id", parkingLotController.deleteParkingLot);
router.get("/:id", parkingLotController.getParkingLotById);

module.exports = router;
