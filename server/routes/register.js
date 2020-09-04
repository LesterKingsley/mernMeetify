const router = require("express").Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const postParser = bodyParser.urlencoded({ extended: true });
const User = require("../models/User");
const { registerValidator } = require("../validators");
router.post("/", postParser, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const { error } = await registerValidator(req.body);
    if (error) return res.status(402).json({ msg: error.details[0].message });

    const userExists = await User.findOne({ email: email });
    if (userExists)
      return res.status(403).json({ msg: "the email is already been used" });

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });
    await newUser.save();
    res.status(200).json({ msg: newUser });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
module.exports = router;
