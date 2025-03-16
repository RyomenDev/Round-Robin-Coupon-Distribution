import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import conf from "../../conf.js";
import Coupon from "../models/Coupon.js";
import { User } from "../models/user.model.js";

const coupons = ["COUPON10", "DISCOUNT20", "SAVE30", "OFFER40"];
let currentIndex = 0;
let activeUsers = new Map();
const guests = new Map(); // Store guest users with assigned coupons
const claimHistory = new Map(); // Tracks claims (IP & Session)
const claimCooldown = 300 * 1000; // 5-minute cooldown

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
    console.log(`User connected: ${socket.id} from IP: ${userIp}`);

    activeUsers.set(socket.id, { ip: userIp });
    io.emit("updateUserCount", activeUsers.size);

    // Assign available coupon
    const availableCoupon = await Coupon.find({ isClaimed: false });
    const assignedCoupon = availableCoupon[currentIndex];
    currentIndex = (currentIndex + 1) % availableCoupon.length;

    // console.log({ assignedCoupon, currentIndex });

    if (assignedCoupon) {
      guests.set(socket.id, assignedCoupon.code);
      socket.emit("couponAssigned", assignedCoupon);
    }

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      activeUsers.delete(socket.id);
      io.emit("updateUserCount", activeUsers.size);
    });
  });

  return io;
}

export const claimCoupon = async (req, res) => {
  console.log("hi");
  console.log(req.body);

  try {
    const clientIp =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    let userSession = req.cookies.sessionId || Date.now().toString();
    if (!req.cookies.sessionId) {
      res.cookie("sessionId", userSession, {
        maxAge: claimCooldown,
        httpOnly: true,
      });
    }

    if (claimHistory.has(clientIp) || claimHistory.has(userSession)) {
      return res
        .status(429)
        .json({ message: "❌ Try again later after 5 minutes." });
    }

    const { couponId } = req.body;
    if (!couponId)
      return res.status(400).json({ message: "Coupon ID is required!" });

    const coupon = await Coupon.findOne({ _id: couponId, isClaimed: false });
    if (!coupon)
      return res
        .status(400)
        .json({ message: "This coupon is unavailable or already claimed!" });

    coupon.isClaimed = true;
    coupon.claimedBy = clientIp;
    coupon.claimedIp = clientIp;
    coupon.claimedAt = new Date();
    await coupon.save();

    claimHistory.set(clientIp, true);
    claimHistory.set(userSession, true);

    res.json({ message: `🎉 Coupon claimed: ${coupon.code}`, coupon });
  } catch (error) {
    console.error("Error claiming coupon:", error);
    res.status(500).json({ message: "Failed to claim coupon." });
  }
};

export const getAllCoupon = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    let coupons;
    if (user.userType === "Admin") {
      coupons = await Coupon.find();
    } else {
      coupons = await Coupon.find({
        $or: [{ isClaimed: false }, { claimedBy: req.ip }],
      }).select("code discount expirationDate isClaimed claimedBy");
    }

    res.json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ error: "Failed to fetch coupons." });
  }
};
