import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import conf from "../../conf.js";

const coupons = ["COUPON10", "DISCOUNT20", "SAVE30", "OFFER40"];
let currentIndex = 0;
let activeUsers = new Map();
const guests = new Map(); // Store guest users with assigned coupons

export function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: conf.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
    //   pingInterval: 5000, // Prevents timeouts by sending a ping every 5 seconds
    //   pingTimeout: 25000, // Extends the timeout period before disconnecting
  });

  // Middleware to verify JWT
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      console.log("Authentication failed: No token provided");
      return next(new Error("Unauthorized"));
    }

    try {
      const decoded = jwt.verify(token, conf.JWT_SECRET);
      socket.userId = decoded.userId; // Attach userId to socket
      next();
    } catch (err) {
      console.log("Authentication failed:", err.message);
      return next(new Error("Invalid or expired token"));
    }
  });

  // Handle connection
  io.on("connection", (socket) => {
    const userIp = socket.handshake.address;
    console.log(`User connected: ${socket.id} from IP: ${userIp}`);

    activeUsers.set(socket.id, { ip: userIp });
    io.emit("updateUserCount", activeUsers.size);

    // Assign coupon in round-robin
    const assignedCoupon = coupons[currentIndex];
    // Move to next coupon
    currentIndex = (currentIndex + 1) % coupons.length;
    // Store assigned coupon
    guests.set(socket.id, assignedCoupon);
    // Send assigned coupon to the guest user
    socket.emit("couponAssigned", assignedCoupon);

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      activeUsers.delete(socket.id);
      io.emit("updateUserCount", activeUsers.size);
    });
  });

  return io;
}
