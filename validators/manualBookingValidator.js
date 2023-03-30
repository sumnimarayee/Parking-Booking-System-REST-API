const { body, validationResult } = require("express-validator");

const manualBookingValidator = [
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
    body("bookedParkingLot")
      .exists()
      .withMessage("booked parking lot is missing")
      .notEmpty()
      .withMessage("booked parking lot is empty")
      .isString()
      .withMessage("invalid booked parking lot"),
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

module.exports = manualBookingValidator;
