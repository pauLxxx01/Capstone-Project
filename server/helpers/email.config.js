const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: 'secure4agapay@gmail.com',
    pass: 'xico jceq erwp qovk',
  },
});

module.exports = { transporter };
