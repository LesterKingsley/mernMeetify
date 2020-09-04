const jwt = require("jsonwebtoken");

const tokenValidator = async (req, res, next) => {
  try {
    const tokenExists = req.header("x-auth-token");
    if (!tokenExists)
      return res.status(401).json({ msg: "token is not found" });

    const verifiedToken = jwt.verify(tokenExists, process.env.SECRET_KEY);
    if (!verifiedToken)
      return res.status(401).json({ msg: "token is invalid" });

    req.user = verifiedToken.id;
    next();
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
module.exports = tokenValidator;
