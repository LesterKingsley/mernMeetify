const router = require("express").Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const postParser = bodyParser.urlencoded({ extended: true });
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { logInValidator } = require("../validators");

router.post("/", postParser, async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error } = await logInValidator(req.body);
    if (error) return res.status(402).json({ msg: error.details[0].message });

    const userExists = await User.findOne({ email: email });
    if (!userExists)
      return res.status(403).json({ msg: "the email is unregistered" });

    const checkPassword = await bcrypt.compare(password, userExists.password);
    if (!checkPassword)
      return res.status(402).json({ msg: "invalid password" });

    const getToken = await jwt.sign(
      { id: userExists._id },
      process.env.SECRET_KEY
    );

    res.status(200).json({ getToken });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
module.exports = router;
