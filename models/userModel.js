const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      // This object here are schema type options object.
      type: String,
      required: [true, "A user must have a name"],
    },
    username: {
      type: String,
      required: [true, "A user must have a username"],
    },
    email: String,
    contactNumber: String,
    password: {
      type: String,
      required: [true, "A user must have a password"],
    },
    profilePictureURL: String,
    isStaff: Boolean,
    isBookingUser: Boolean,
    role: {
      type: String,
      required: [true, "A user must have a role"],
    },
    gender: {
      type: String,
      required: [true, "A user must have a gender"],
    },
    vehicleType: {
      type: String,
      required: [true, "A user must have vechicle type"],
    },
    vehiclePlateNumber: {
      type: String,
      required: [true, "A user must have vehicle plate number"],
    },
    latitude: String,
    longitude: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
