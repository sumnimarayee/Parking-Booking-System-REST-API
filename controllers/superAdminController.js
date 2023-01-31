const ParkingLot = require("../models/parkingLotModel");
const User = require("../models/userModel");

exports.createAccount = async (req, res, next) => {
  let managingStaff = new User({
    name: "staff",
    email: req.body.email,
    password: "password",
    contactNo: "9813299264",
    gender: "gay",
    vehicleType: "2",
  });
  const createdStaff = await managingStaff.save();
  console.log(createdStaff);
  //   let parkingLot = new ParkingLot({
  //     name: req.body.name,
  //     longitude: req.body.longitude,
  //     latitude: req.body.latitude,
  //     location: req.body.location,
  //     managingStaff: "abc",
  //     bikeParkingCapacity: 0,
  //     carParkingCapacity: 0,
  //     bikeParkingCostPerHour: 0,
  //     carParkingCostPerHour: 0,
  //   });
  //   ParkingLot.Save().then((data) => {
  //     res.json({
  //       status: 200,
  //       message: "success!",
  //       data,
  //     });
  //   });
};
