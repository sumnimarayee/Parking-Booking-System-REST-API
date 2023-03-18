const express = require("express");
const parkingLotController = require("../controllers/parkingLotController");
const router = express.Router();
const createParkingLotValidator = require("../validators/createParkingLotValidator");

router.get("/", parkingLotController.getAllParkingLots);
router.delete("/:id", parkingLotController.deleteParkingLot);
router.get("/:id", parkingLotController.getParkingLotById);
router.post("/", createParkingLotValidator, parkingLotController.createAccount);
router.patch("/:id", parkingLotController.updateParkingLot);

module.exports = router;
