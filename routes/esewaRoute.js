const express = require("express");
const esewaController = require("../controllers/esewaController");

const router = express.Router();

router.post("/", esewaController.createEsewa);

module.exports = router;
