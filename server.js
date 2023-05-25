const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const http = require("./app");

const DB = mongoose

  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 3001;
http.listen(port, () => {
  console.log(`App running on port ${port}`);
});
