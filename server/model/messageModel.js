const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new mongoose.Schema(
  {
    emergency: {
      type: String,
      enum: [
        "Fire Emergency",
        "Medical Assistance",
        "Natural Hazard",
        "Crime / Violence",
        "Biological Hazard",
        "Utility Failure",
      ],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    percentage: {
      type: String,
      default: "0%",
    },
    message: {
      type: String,
      trim: true,
    },
    respond: {
      type: String,
      enum: ["completed", "in-progress", "unused"],
      default: "unused",
    },
    responder: [
      {
        type: Schema.Types.ObjectId,
        ref: "Responder",
      },
    ],
    senderId: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
