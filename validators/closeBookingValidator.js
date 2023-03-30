const { body, validationResult } = require("express-validator");

const closeBookingValidator = [
  [
    body("bookingId")
      .exists()
      .withMessage("Booking id is missing")
      .notEmpty()
      .withMessage("Booking id is empty")
      .isString()
      .withMessage("invalid booking id"),
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

module.exports = closeBookingValidator;
