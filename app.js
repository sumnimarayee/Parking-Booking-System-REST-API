const express = require("express");
const cors = require("cors");
const router = require("./index");
const app = express();
const authRoutes = require("./routes/authenticationRoute");
const notificationRoutes = require("./routes/notificationRoute");
const { validateToken } = require("./utils/authenticationHandler");
const cookieParser = require("cookie-parser");
const { credentials } = require("./utils/credentials");
const corsOptions = require("./utils/corsOption");
const http = require("http").Server(app);
const { Server } = require("socket.io");
const { sendNotification } = require("./utils/notificationHandler");
require("./utils/cron");
const io = new Server({
  cors: {
    origin: "*",
  },
});
sendNotification(
  "fvRPVfGHEJaeZhyZExMK0e:APA91bEa0UWV45-iiXlIWvy67jauLIkbfffzmQ6LO3EiIMfgL_R_YzK-YPnrRYaAxOlvd7cXX2Kav7dgAA-NR7ZuAEyP-D8rpUNNX_ms_pQNEBEEVgOQpHBodNQnU_15LhZjzMMEWlHt",
  "Booking Expired",
  "Your booking has been expired. You will be charged extra amount when checking out"
);
io.on("connection", (socket) => {
  socket.on("disconnect", () => {});
});
io.listen(http);

// Handle options credentials check - before CORS!
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use("/notifications/", notificationRoutes);
app.use(authRoutes);
app.use(validateToken);
app.use(router);

// error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ error: true, message: message });
});

module.exports = http;
