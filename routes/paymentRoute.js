const express = require("express");
const paymentController = require("../controllers/paymentController");
const router = express.Router();

router.get("/khalti/:token/:amount/:secretkey", paymentController.payViaKhalti);
module.exports = router;
