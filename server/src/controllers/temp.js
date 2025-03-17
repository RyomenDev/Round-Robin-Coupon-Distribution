import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import conf from "../../conf.js";
import Coupon from "../models/Coupon.js";
import { User } from "../models/user.model.js";

// const coupons = ["COUPON10", "DISCOUNT20", "SAVE30", "OFFER40"];
let currentIndex = 0;
let activeUsers = new Map();
const guests = new Map(); // Store guest users with assigned coupons
const assignedCoupons = new Set(); // Track assigned coupons to prevent reassignments

const claimHistory = new Map(); // Tracks claims (IP & Session)
const claimCooldown = 300 * 1000; // 5-minute cooldown

// let io;
export function initializeSocket(server) {
  const io = new Server(server, {
    //   io = new Server(server, {
    cors: {
      origin: conf.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
    //   pingInterval: 5000, // Prevents timeouts by sending a ping every 5 seconds
    //   pingTimeout: 25000, // Extends the timeout period before disconnecting
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));

    try {
      const decoded = jwt.verify(token, conf.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      return next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", async (socket) => {
    const userIp = socket.handshake.address;
    const userId = socket.userId;
    console.log(
      `User connected: ${socket.id} with userId: ${userId}from IP: ${userIp}`
    );

    activeUsers.set(socket.id, { ip: userIp });
    io.emit("updateUserCount", activeUsers.size);

    // Assign available coupon
    const availableCoupon = await Coupon.find({ isClaimed: false });
    // console.log({availableCoupon});

    const assignedCoupon = availableCoupon[currentIndex];

    currentIndex = (currentIndex + 1) % availableCoupon.length;

    // console.log({ assignedCoupon, currentIndex });

    if (assignedCoupon) {
      guests.set(socket.id, assignedCoupon.code);
      socket.emit("couponAssigned", assignedCoupon);
    }

    // Find an available coupon that is NOT claimed and NOT assigned
    // const availableCoupons = await Coupon.find({ isClaimed: false });

    // let assignedCoupon = null;
    // for (const coupon of availableCoupons) {
    //   if (!assignedCoupons.has(coupon.code)) {
    //     assignedCoupon = coupon;
    //     assignedCoupons.add(coupon.code);
    //     break;
    //   }
    // }

    // if (assignedCoupon) {
    //   guests.set(socket.id, assignedCoupon.code);
    //   socket.emit("couponAssigned", assignedCoupon);
    // } else {
    //   socket.emit("noCouponsAvailable");
    // }

    socket.on("disconnect", () => {
      //   console.log(`User disconnected: ${socket.id}`);
      activeUsers.delete(socket.id);
      io.emit("updateUserCount", activeUsers.size);

      // Remove the assigned coupon from the tracking list
      //   const couponCode = guests.get(socket.id);
      //   if (couponCode) {
      //     assignedCoupons.delete(couponCode);
      //     guests.delete(socket.id);
      //   }
    });
  });

  console.log("Assigned Coupons:", assignedCoupons.size);
  for (let i of assignedCoupons) {
    console.log(i);
  }

  return io;
}
