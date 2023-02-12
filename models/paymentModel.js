const mongoose = require("mongoose");

const payment = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Types.ObjectId,
      required: [true, "A payment must have a booking id"],
    },
    paymentAmount: {
      type: Number,
      required: [true, "A payment must have a payment amount"],
    },
    paymentStatus: {
      type: Number,
      required: [true, "A payment must have a payment status"],
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
