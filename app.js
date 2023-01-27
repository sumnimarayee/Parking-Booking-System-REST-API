const express = require("express");
const cors = require("cors");

const app = express();

const userRouter = require("./routes/userRoute");

app.use(cors());

app.use(express.json());

app.use("/user", userRouter);

module.exports = app;
