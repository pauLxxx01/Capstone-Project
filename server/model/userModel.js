const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["Student", "Professor"],
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,

      min: 8,
    },
    account_id: {
      type: String,
      unique: true,
    },
    phone_number: {
      type: String,
    },
    department: {
      type: String,
    },
    address: {
      type: String,
    },
    report: {
      type: Schema.Types.ObjectId,
      ref: "Report",
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Parent",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);