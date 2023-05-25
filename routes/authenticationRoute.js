const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const loginValidator = require("../validators/loginValidator");
const registrationValidator = require("../validators/registerValidator");
const changePasswordValidator = require("../validators/changePasswordValidator");

router.post("/register-user", registrationValidator, userController.register);
router.post("/login", loginValidator, userController.login);
router.get("/refresh", userController.refresh);
router.post("/logout", userController.logout);
router.patch(
  "/change-password",
  changePasswordValidator,
  userController.updatePassword
);

module.exports = router;
