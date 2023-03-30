const Payment = require("../models/paymentModel");

exports.addNewPaymentForManualBooking = async (bookingId, amount) => {
  const payment = new Payment({ bookingId, paymentAmount: amount });
  await payment.save();
};

exports.updatePaymentForAdditionalDuration = async (bookingId, amount) => {
  const payment = await Payment.findOne({ bookingId });
  if (!payment) {
    const error = new Error("The payment with given booking id does not exist");
    error.statusCode = 401;
    throw error;
  }
  payment.paymentAmount += amount;

  await payment.save();
};

const getPaymentByBookingId = async (bookingId) => {
  return await Payment.find({ bookingId });
};
