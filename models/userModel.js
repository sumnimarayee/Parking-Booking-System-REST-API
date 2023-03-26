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
    isStaff: {
      type: Boolean,
      required: [true, "A user can be a staff member"],
    },
    isBookingUser: {
      type: Boolean,
      required: [true, "A user can be a booking user"],
    },
    isSuperAdmin: {
      type: Boolean,
      required: [true, "A user can be a super admin"],
    },
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
    refreshToken: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
