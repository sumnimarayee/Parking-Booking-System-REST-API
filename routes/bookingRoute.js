const express = require("express");
const bookingController = require("../controllers/bookingController");
const bookingValidator = require("../validators/bookingValidator");

const router = express.Router();

router.post("/", bookingValidator, bookingController.createBooking);
