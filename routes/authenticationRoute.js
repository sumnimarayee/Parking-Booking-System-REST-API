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

// for logout implementation, we need to implement the storage of refresh token in the user model as well and in the generate refresh token service, need to check if the user has refresh token stored or not. If not then the user has logged out and refresh token api wont work

module.exports = router;
