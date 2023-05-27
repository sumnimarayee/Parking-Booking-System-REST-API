const express = require("express");
const parkingLotController = require("../controllers/parkingLotController");
const router = express.Router();
const createParkingLotValidator = require("../validators/createParkingLotValidator");
const { validateRole } = require("../utils/authenticationHandler");

router.get(
  "/",
  validateRole(["user", "staff", "superAdmin"]),
  parkingLotController.getAllParkingLots
);
router.delete(
  "/:id",
  validateRole(["superAdmin"]),
  parkingLotController.deleteParkingLot
);
router.get(
  "/:id",
  validateRole(["user", "staff", "superAdmin"]),
  parkingLotController.getParkingLotById
);
router.post(
  "/",
  validateRole(["superAdmin"]),
  createParkingLotValidator,
  parkingLotController.createAccount
);
router.patch(
  "/:id",
  validateRole(["staff"]),
  parkingLotController.updateParkingLot
);
router.get(
  "/staff/:id",
  validateRole(["staff"]),
  parkingLotController.getParkingLotByStaffId
);

module.exports = router;
