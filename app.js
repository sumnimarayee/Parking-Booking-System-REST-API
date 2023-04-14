const express = require("express");
const cors = require("cors");
const router = require("./index");
const app = express();
const authRoutes = require("./routes/authenticationRoute");
const { validateToken } = require("./utils/authenticationHandler");
const cookieParser = require("cookie-parser");
const { credentials } = require("./utils/credentials");
const corsOptions = require("./utils/corsOption");
const http = require("http").Server(app);
const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
io.listen(http);

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
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ error: true, message: message });
});

module.exports = http;
