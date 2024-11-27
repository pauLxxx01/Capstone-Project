const userModel = require("../model/userModel");
const ReportModel = require("../model/reportModel");
const { sendNotificationToAdmins, sendReport } = require("../sockets/socket");

const sendNotification = async (req, res) => {
  const { message } = req.body;
  sendNotificationToAdmins(message);
  res.status(200).send("Notification sent!");
};

const sendReportToAdmin = async (req, res) => {
  try {
    const { emergency, location, message, senderId, percentage } = req.body;

    if (!req.file) {
      console.error("No file uploaded!.");
      return res.status(400).send("No file uploaded!!.");
    }
    if (!emergency) {
      console.log("ERROR ", emergency);
      return res
        .status(400)
        .send({ success: false, message: "Emergency type is required" });
    }

    if (!location) {
      console.log("ERROR ", location);
      return res
        .status(400)
        .send({ success: false, message: "Location is required" });
    }

    if (!message) {
      console.log("ERROR ", message);
      return res
        .status(400)
        .send({ success: false, message: "Message is required" });
    }

    const user = await userModel.findById(senderId); // Corrected this line
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User  not found",
      });
    }
    console.log(`user id: ${user}`);

    const newMessage = new ReportModel({
      emergency,
      location,
      percentage,
      img: req.file ? req.file.filename : null, // Check if req.file exists
      message,
      senderId,
    });

    const savedMessage = await newMessage.save();

    // Save the new message ID to the user's messages array
    user.message = user.message || []; // Ensure messages array exists
    user.message.push(savedMessage._id); // Add the new message ID
    await user.save(); // Save the updated user document

    sendReport(emergency, location, message, senderId, percentage,  req.file.filename);
    console.log(user.message);
    return res.status(201).send({
      success: true,
      message: "Message reported successfully",
      data: savedMessage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }

};

module.exports = {
  sendNotification,
  sendReportToAdmin,
};
