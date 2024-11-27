// sockets/socket.js
const JWT = require("jsonwebtoken");
const { Server } = require("socket.io");
const colors = require("colors");
const adminModel = require("../model/adminModel");

let activeSockets = {}; // Object to store sockets by user ID

// WebSocket authentication middleware
const socketIoMiddleware = (socket, next) => {
  const token = socket.handshake.query.token;

  if (!token) {
    return next(new Error("Authentication error: Token is missing"));
  }

  // Verify token
  JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error("Unauthorized"));
    }

    console.log("Decoded Token: ", decoded);

    activeSockets[decoded._id] = socket;

    // Attach decoded user info to the socket object
    socket.user = decoded;

    next(); // Proceed with the connection
  });
};

// WebSocket connection logic
const socketConnection = (socket) => {
  console.log(
    `User Connected: ${socket.user._id} - ${socket.user.name} - ${socket.id} `
      .bgCyan.white
  );

  // Example of emitting an event after a successful connection
  socket.emit("userConnected", {
    userId: socket.user._id,
    name: socket.user.name,
  });

  socket.on("notification", (notif) => {
    console.log("Notification from server socket: " + notif);

  });

  socket.emit("receive-notification", (notif) => {
    console.log("Notification received:", notif);
  })

  socket.on('report', (reportData) => {

  });
  
  socket.on("disconnect", () => {
    console.log(
      `User disconnected: ${socket.user._id} - ${socket.user.name} - ${socket.id}`
        .bgRed.white
    );
  });
};

async function sendNotificationToAdmins(message) {
  try {
    // Query all users with the role "admin"
    const admins = await adminModel.find({ role: "admin" });

    // Notify each admin (assuming you store socket connections in activeSockets)
    admins.forEach((admin) => {
      const socket = activeSockets[admin._id]; // or admin.name depending on your key

      if (socket) {
        socket.emit("notification", message); // Send the notification to the admin
        console.log(`Notification sent to admin ${admin.name} --- ${message}`);
      } else {
        console.log(`Admin ${admin.name} is not connected`);
      }
    });
  } catch (error) {
    console.error("Error sending notification to admins:", error);
  }
}

async function sendReport(emergency, location, message, senderId, percentage, img) {
  try {
    const admins = await adminModel.find({ role: 'admin' });

    admins.forEach((admin) => {
      const socket = activeSockets[admin._id]; // or admin.name depending on your key
     
      if (socket) {
        socket.emit('report', {
          emergency,
          location,
          message,
          senderId,
          percentage,
          img
        }); // Send detailed report
        console.log(`Report sent to admin ${admin.name} --- ${senderId}`);
      } else {
        console.log(`Admin ${admin.name} is not connected`);
      }
    })
  } catch (error) {
    console.error("Error sending report to admins:", error);
  }
}

// Initialize and configure WebSocket server
const initializeSocket = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  // Use authentication middleware for WebSocket connections
  io.use(socketIoMiddleware);

  // Handle WebSocket connection
  io.on("connection", socketConnection);

  global.io = io;
};

module.exports = { initializeSocket, sendNotificationToAdmins,sendReport };
