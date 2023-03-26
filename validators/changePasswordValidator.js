const { body, validationResult } = require("express-validator");

const changePasswordValidator = [
  [
    body("password")
      .exists()
      .withMessage("password is missing")
      .notEmpty()
      .withMessage("password is empty")
      .isString()
      .withMessage("invalid password")
      .isLength({ min: 6 })
      .withMessage("password must be at least 6 characters"),
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

module.exports = changePasswordValidator;
