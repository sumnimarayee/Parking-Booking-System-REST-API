const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const loginValidator = require("../validators/loginValidator");
const registrationValidator = require("../validators/registerValidator");

router.post("/register-user", registrationValidator, userController.register);
router.post("/login", loginValidator, userController.login);

module.exports = router;
