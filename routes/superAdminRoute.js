const express = require("express");
const superAdminController = require("../controllers/superAdminController");
const router = express.Router();

router.post("/parking-lot", superAdminController.createAccount);

module.exports = router;
