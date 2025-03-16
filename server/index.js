import cors from "cors";
import connectDB from "./src/config/db.js";
import { app } from "./src/app.js";
import jwt from "jsonwebtoken";
import conf from "./conf.js";

// const http = require("http");
import http from "http";
// const { Server } = require("socket.io");
import { Server } from "socket.io";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: conf.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
  //   pingInterval: 5000, // Prevents timeouts by sending a ping every 5 seconds
  //   pingTimeout: 25000, // Extends the timeout period before disconnecting
});

const coupons = ["COUPON10", "DISCOUNT20", "SAVE30", "OFFER40"];
let currentIndex = 0;

let activeUsers = new Map(); // Use a Map instead of a Set to store IPs with socket IDs
const guests = new Map(); // Store guest users with socket ID

// Middleware to verify token for WebSocket connections
io.use((socket, next) => {
  const token = socket.handshake.auth?.token; // Get token from handshake
  if (!token) {
    console.log("Authentication failed: No token provided");
    return next(new Error("Unauthorized"));
  }

  try {
    const JWT_SECRET = conf.JWT_SECRET;

    const decoded = jwt.verify(token, JWT_SECRET);

    socket.userId = decoded.userId; // Attach user ID to the socket instance
    next();
  } catch (err) {
    console.log("Authentication failed: Invalid or expired token", err.message);
    return next(new Error("Invalid or expired token"));
  }
});

io.on("connection", (socket, next) => {
  const userId = socket.userId;
  console.log({ userId });

  //   console.log(`User connected: ${socket.id}`);
  const userIp = socket.handshake.address; // Get user IP from the socket handshake
  console.log(`User connected: ${socket.id} from IP: ${userIp}`);

  //   activeUsers.add(socket.id);

  activeUsers.set(socket.id, { ip: userIp });

  io.emit("updateUserCount", activeUsers.size);

  // Assign a coupon in round-robin fashion
  const assignedCoupon = coupons[currentIndex];
  currentIndex = (currentIndex + 1) % coupons.length; // Move to next coupon

  guests.set(socket.id, assignedCoupon); // Store assigned coupon

  // Send assigned coupon to the guest user
  socket.emit("couponAssigned", assignedCoupon);

  socket.on("disconnect", () => {
    // console.log(`User disconnected: ${socket.id}`);
    activeUsers.delete(socket.id);
    io.emit("updateUserCount", activeUsers.size);
  });
});

const PORT = conf.PORT || 5000;

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    await connectDB();
    // app.listen(PORT, () => {
    //   console.log(`⚙️ Server is running at port: ${PORT}`);
    // });
    server.listen(PORT, () => {
      console.log(`⚙️ Server is running at port: ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
  }
};

startServer();
