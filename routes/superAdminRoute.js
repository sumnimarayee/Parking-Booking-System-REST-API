const express = require("express");
const superAdminController = require("../controllers/superAdminController");
const superAdminValidator = require("../validators/superAdminValidator");
const router = express.Router();

router.post(
  "/parking-lot",
  superAdminValidator,
  superAdminController.createAccount
);

module.exports = router;
