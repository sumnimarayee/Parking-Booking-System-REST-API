const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = mongoose

  .connect(process.env.DATABASE, {
    //connect method return promise.
    useNewUrlParser: true, // deal with some deprecation warnings.
  })
  .then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
