const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const twoFactAuthRoute = require("./routes/twoFactAuthRoute");

const app = express();
app.use(express.json());
app.use("/two-factor-auth", twoFactAuthRoute);
app.listen(process.env.PORT, () => {
  console.log(
    `Two factor authentication server is running on port: ${process.env.PORT}`
  );
});
