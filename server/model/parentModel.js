const mongoose = require("mongoose");
const { Schema } = mongoose;

const parentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add name"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Please add userId"],
    },
    address: {
      type: String,
      trim: true,
    },
    relationship: {
      type: String,
      enum: ["Mother", "Father", "Guardian"],
      required: true,
    },
    children: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Parent", parentSchema);
