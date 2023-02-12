const { body, validationResult } = require("express-validator");

const bookingValidator = [
  [
    body("vehicleType")
      .exists()
      .withMessage("Vehicle type is missing")
      .notEmpty()
      .withMessage("Vehicle type is empty")
      .isString()
      .withMessage("invalid vehicle type"),
    body("vehiclePlateNo")
      .exists()
      .withMessage("Vehicle plate no is missing")
      .notEmpty()
      .withMessage("Vehicle plate no  is empty")
      .isString()
      .withMessage("invalid vehicle plate no")
      .isLength({ min: 4, max: 4 })
      .withMessage("Vehicle plate no must be excatly 4 characters"),
    body("bookedTime")
      .exists()
      .withMessage("Booked time is missing")
      .notEmpty()
      .withMessage("Booked time is empty")
      .isString()
      .withMessage("invalid booked time"),
    body("bookedParkingLot")
      .exists()
      .withMessage("booked parking lot is missing")
      .notEmpty()
      .withMessage("booked parking lot is empty")
      .isString()
      .withMessage("invalid booked parking lot"),
    body("pinNo")
      .exists()
      .withMessage("Pin no is missing")
      .notEmpty()
      .withMessage("Pin no is empty")
      .isString()
      .withMessage("invalid pin no"),
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

module.exports = bookingValidator;
