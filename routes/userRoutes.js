const express = require("express");
const userController = require("../controllers/userController");
const { validateRole } = require("../utils/authenticationHandler");
const router = express.Router();

router.patch("/:id", validateRole(["user"]), userController.updateUser);
router.get("/:id", validateRole(["staff", "user"]), userController.getUserData);

module.exports = router;
