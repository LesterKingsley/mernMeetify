const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, min: 6, max: 255 },
  email: { type: String, required: true, min: 6, max: 255 },
  password: { type: String, required: true, min: 6, max: 255 },
  connections: [{ type: ObjectId, ref: "User", required: true }],
  requests: [{ type: ObjectId, ref: "User", required: true }],
  profilePic: { type: String, default: "" },
  bio: { type: String, min: 6, max: 2000, default: "no bio" },
  job: { type: String, default: "no job specified" },
  number: { type: Number, min: 3, max: 25, default: null },
  address: { type: String, min: 3, max: 255, default: "no address" },
});

module.exports = mongoose.model("User", userSchema);
