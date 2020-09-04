//SET UPS
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
//Routers
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const userRoute = require("./routes/user");
const tokenRoute = require("./routes/token");
app.use("/meetify/register", registerRoute);
app.use("/meetify/login", loginRoute);
app.use("/meetify/user", userRoute);
app.use("/meetify/tokenVerify", tokenRoute);
//mongoose DB
mongoose.connect(process.env.DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("welcome to the database"));
//server
app.listen(7000, () => console.log("welome to the server"));
