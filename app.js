const express = require("express");
const cors = require("cors");
const router = require("./index");
const app = express();
const authRoutes = require("./routes/authenticationRoute");
// const { validateToken } = require("./utils/authenticationHandler");

app.use(cors());

app.use(express.json());
app.use(authRoutes);
// app.use(validateToken);
app.use(router);

module.exports = app;
