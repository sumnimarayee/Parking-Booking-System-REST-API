const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      // This object here are schema type options object.
      type: String,
      required: [true, "A user must have a name"],
    },
    email: {
      type: String,
      required: [true, "A user must have a email"],
    },
    contactNumber: String,
    password: {
      type: String,
      required: [true, "A user must have a password"],
    },
    profilePictureURL: String,
    isStaff: Boolean,
    isBookingUser: Boolean,
    isSuperAdmin: Boolean,
    gender: {
      type: String,
      required: [true, "A user must have a gender"],
    },
    vehicleType: {
      type: String,
      required: [true, "A user must have vechicle type"],
    },
    latitude: String,
    longitude: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
