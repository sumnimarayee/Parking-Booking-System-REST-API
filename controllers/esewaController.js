const esewaService = require("../services/esewaService");

exports.createEsewa = async (req, res, next) => {
  await esewaService.createNewEsewa(req.user._id, req.body.pinNo);
  res.status(200).json({
    message: "Success",
  });
};
