const router = require("express").Router();
const jwt = require("jsonwebtoken");
router.post("/", async (req, res) => {
  try {
    const token = await req.header("x-auth-token");
    if (!token) return res.status(403).json({ msg: "token not found" });
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    if (!verifyToken) return res.status(402).json({ msg: "token is invalid" });
    res.status(200).send(true);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
