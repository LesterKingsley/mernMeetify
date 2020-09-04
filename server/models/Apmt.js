const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const ApmtSchema = new mongoose.Schema({
  name: { type: String, min: 1, max: 3000, required: true },
  createdBy: { type: ObjectId, ref: "User", required: true },
  descript: { type: String, min: 1, max: 3000, required: true },
  participants: [{ type: ObjectId, ref: "User" }],
  connections: [{ type: ObjectId, ref: "User", required: true }],
  dateOfMeeting: { type: Date, required: true },
  dateCreated: { type: Date, required: true, default: Date.now },
  rejected: [{ type: ObjectId, ref: "User", required: true }],
  approved: [{ type: ObjectId, ref: "User", required: true }],
});
module.exports = mongoose.model("Apmt", ApmtSchema);
