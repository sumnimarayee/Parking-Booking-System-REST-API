const { body, validationResult } = require("express-validator");

const createParkingLotValidator = [
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
      .isString()
      .withMessage("invalid email"),
    body("longitude")
      .exists()
      .withMessage("longitude is missing")
      .notEmpty()
      .withMessage("longitude is empty")
      .isNumeric()
      .withMessage("invalid longitude"),
    body("latitude")
      .exists()
      .withMessage("latitude is missing")
      .notEmpty()
      .withMessage("latitude is empty")
      .isNumeric()
      .withMessage("invalid latitude"),
    body("location")
      .exists()
      .withMessage("location is missing")
      .notEmpty()
      .withMessage("location is empty")
      .isString()
      .withMessage("invalid location"),
  ],
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(401).json({ message: "invalid payload", ...errors });
    } else {
      next();
    }
  },
];

module.exports = createParkingLotValidator;
