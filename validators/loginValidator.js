const { body, validationResult } = require("express-validator");
// const mongodb = require("mongodb");
const loginValidator = [
  [
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
      .withMessage("password minimum length must be 6 characters"),
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

module.exports = loginValidator;
