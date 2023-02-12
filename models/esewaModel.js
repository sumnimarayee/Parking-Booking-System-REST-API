const mongoose = require("mongoose");

const esewaSchema = new mongoose.Schema(
  {
    pinNo: {
      type: String,
      required: [true, "Pin no is required"],
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: [true, "User id is required"],
    },
    balance: {
      type: Number,
      required: [true, "Balance is required"],
    },
  },
  { timestamps: true }
);

const Esewa = mongoose.model("Esewa", esewaSchema);
module.exports = Esewa;
