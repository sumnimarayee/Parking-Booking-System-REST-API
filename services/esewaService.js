const { TokenExpiredError } = require("jsonwebtoken");
const Esewa = require("../models/esewaModel");

exports.fetchByUserId = async (userId) => {
  const esewa = await Esewa.findOne({ userId: userId });
  if (esewa === null || esewa === undefined) {
    const error = new Error("Esewa for provided userid is not found");
    error.statusCode = 401;
    throw error;
  }
  return esewa;
};

exports.deductBalanceByUserId = async (userId, amountToDeduct) => {
  try {
    const esewaObj = await this.fetchByUserId(userId);
    if (esewaObj.balance < amountToDeduct) {
      throw new Error("Insufficient funds");
    }
    esewaObj.balance -= amountToDeduct;
    await esewaObj.update();
  } catch (err) {
    err.statusCode = 401;
    throw err;
  }
};

exports.createNewEsewa = async (userId, pinNo) => {
  const esewa = new Esewa({
    userId,
    pinNo,
    balance: "1000",
  });

  const savedEsewa = await esewa.save();
};
