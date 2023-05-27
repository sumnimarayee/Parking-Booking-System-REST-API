const axios = require("axios");
exports.payViaKhalti = async (req, res, next) => {
  try {
    const { token, amount, secretkey } = req.params;
    console.log(".................");
    console.log(token, amount, secretkey);
    console.log(req.body);

    let data = {
      token: token,
      amount: Number(amount),
    };

    let config = {
      headers: { Authorization: `Key ${secretkey}` },
    };

    const response = await axios.post(
      "https://khalti.com/api/v2/payment/verify/",
      data,
      config
    );
    console.log(response);

    res.status(200).json({
      message: "Success",
      data: response.data,
    });
  } catch (err) {
    next(err);
  }
};
