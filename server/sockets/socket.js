// sockets/socket.js
const JWT = require("jsonwebtoken");
const { Server } = require("socket.io");
const colors = require("colors");

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

    console.log('Decoded Token: ', decoded);

    // Attach decoded user info to the socket object
    socket.user = decoded;

    next(); // Proceed with the connection
  });
};

// WebSocket connection logic
const socketConnection = (socket) => {
  console.log(`User Connected: ${socket.user._id} - ${socket.user.name}- ${socket.id} `.bgCyan.white);

  // Example of emitting an event after a successful connection
  socket.emit("userConnected", {
    account_id: socket.user._id,
  });

   // Listen for real-time updates
   socket.on("dataUpdated", (updatedData) => {
    console.log("Real-time data received:", updatedData);
    setData(updatedData);
  });

  socket.on("disconnect", () => {
    console.log(
      `User disconnected: ${socket.user._id} - ${socket.id}`.bgRed.white
    );
  });
};

// Initialize and configure WebSocket server
const initializeSocket = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  // Use authentication middleware for WebSocket connections
  io.use(socketIoMiddleware);

  // Handle WebSocket connection
  io.on("connection", socketConnection);

  global.io = io;
};

module.exports = initializeSocket;
