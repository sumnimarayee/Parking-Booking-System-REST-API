const { body, validationResult } = require("express-validator");

const registrationValidator = [
  [
    body("name")
      .exists()
      .withMessage("name is missing")
      .notEmpty()
      .withMessage("name is empty")
      .isString()
      .withMessage("invalid name"),
    body("email")
      .exists()
      .withMessage("email is missing")
      .notEmpty()
      .withMessage("email is empty")
      .isEmail()
      .withMessage("invalid email"),
    body("password")
      .exists()
      .withMessage("password is missing")
      .notEmpty()
      .withMessage("password is empty")
      .isString()
      .withMessage("invalid password")
      .isLength({ min: 6 })
      .withMessage("password must be at least 6 characters"),
    body("contactNo")
      .exists()
      .withMessage("contactNo is missing")
      .notEmpty()
      .withMessage("contactNo is empty")
      .isString()
      .withMessage("invalid contactNO"),
    body("gender")
      .exists()
      .withMessage("gender is missing")
      .notEmpty()
      .withMessage("gender is empty")
      .isString()
      .withMessage("invalid gender"),
    body("vehicleType")
      .exists()
      .withMessage("vehicle type is missing")
      .notEmpty()
      .withMessage("vehicle type is empty")
      .isString()
      .withMessage("invalid vehicle type"),
  ],
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: "invalid payload", ...errors });
    } else {
      next();
    }
  },
];

module.exports = registrationValidator;
