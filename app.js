const express = require("express");
const cors = require("cors");
const router = require("./index");
const app = express();
const authRoutes = require("./routes/authenticationRoute");
const { validateToken } = require("./utils/authenticationHandler");
const cookieParser = require("cookie-parser");
const { credentials } = require("./utils/credentials");
const corsOptions = require("./utils/corsOption");

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(authRoutes);
app.use(validateToken);

app.use(router);

// error handling middleware
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ error: true, message: message });
});

module.exports = app;
