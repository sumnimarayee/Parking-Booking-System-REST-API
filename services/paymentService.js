exports.addNewPaymentForManualBooking = async (bookingId, amount) => {
  const payment = new Payment({ bookingId, paymentAmount: amount });
  await payment.save();
};

exports.updatePaymentForAdditionalDuration = async (bookingId, amount) => {
  const booking = await getBookingById(bookingId);
  if (!booking) {
    const error = new Error("The booking does not exist");
    error.statusCode = 404;
    throw error;
  }
  booking.paymentAmount += amount;

  await booking.update();
};

const getBookingById = async (bookingId) => {
  return await Booking.findById(bookingId);
};
