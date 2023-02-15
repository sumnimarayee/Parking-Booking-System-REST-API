const esewaService = require("../services/esewaService");

exports.createEsewa = async (req, res, next) => {
  await esewaService.createNewEsewa(req.body.userId, req.body.pinNo);
  res.status(200).json({
    message: "Success",
  });
};
