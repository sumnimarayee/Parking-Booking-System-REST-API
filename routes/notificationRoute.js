const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.patch("/:id", userController.addNotificationToken);

module.exports = router;
