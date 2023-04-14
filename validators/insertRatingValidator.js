const { body, validationResult } = require("express-validator");

const insertRatingValidator = [
  [
    body("rating")
      .exists()
      .withMessage("Rating is missing")
      .notEmpty()
      .withMessage("Rating is empty")
      .isNumeric()
      .withMessage("Rating must be a number")
      .isFloat({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("review")
      .exists()
      .withMessage("Review is missing")
      .isString()
      .withMessage("Review must be a string")
      .isLength({ max: 250 })
      .withMessage("Review must be at most 250 characters long"),
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

module.exports = insertRatingValidator;
