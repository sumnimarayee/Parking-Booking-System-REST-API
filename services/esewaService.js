const Esewa = require("../models/esewaModel");

exports.fetchByUserId = async (userId) => {
  try {
    const esewa = await Esewa.findOne({ userId: userId });
    if (esewa === null || esewa === undefined) {
      throw new Error("Esewa for provided userid is not found");
    }
    return esewa;
  } catch (err) {
    return {
      type: "error",
      message: err.message,
    };
  }
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
    throw new Error({
      type: "error",
      message: err.message,
    });
  }
};
