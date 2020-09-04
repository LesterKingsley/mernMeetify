const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Photo = new Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalname: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Photo", Photo);
