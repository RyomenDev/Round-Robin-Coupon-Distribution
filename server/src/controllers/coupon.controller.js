import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import conf from "../../conf.js";
import Coupon from "../models/Coupon.js";
import { User } from "../models/user.model.js";

let currentIndex = 0; // Rotating index for coupon assignment
let activeUsers = new Map();
const guests = new Map(); // Store userId, IP, and assigned coupon
const assignedCoupons = new Set(); // Track assigned coupons to prevent reassignments

const COUPON_TIMEOUT = 2 * 1000; // 30 seconds

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

    // console.log(
    //   `User connected: ${socket.id} with userId: ${userId} from IP: ${userIp}`
    // );

    activeUsers.set(socket.id, { userId, ip: userIp });
    io.emit("updateUserCount", activeUsers.size);

    assignCoupon(socket, userId, userIp, io);

    socket.on("disconnect", () => {
      //   console.log(`User disconnected: ${socket.id}`);

      activeUsers.delete(socket.id);
      io.emit("updateUserCount", activeUsers.size);

      // Release the coupon back into availability
      if (guests.has(socket.id)) {
        const userData = guests.get(socket.id);
        assignedCoupons.delete(userData.coupon);
        guests.delete(socket.id);
      }
    });
  });

  return io;
}

// Function to assign a coupon
async function assignCoupon(socket, userId, userIp, io) {
  const availableCoupons = await Coupon.find({ isClaimed: false });

  if (availableCoupons.length === 0) {
    socket.emit("noCouponsAvailable");
    return;
  }

  currentIndex = currentIndex % availableCoupons.length;

  let assignedCoupon = null;
  for (let i = 0; i < availableCoupons.length; i++) {
    let index = (currentIndex + i) % availableCoupons.length;
    let coupon = availableCoupons[index];

    if (!assignedCoupons.has(coupon.code)) {
      assignedCoupon = coupon;
      assignedCoupons.add(coupon.code);
      guests.set(socket.id, {
        userId,
        ip: userIp,
        coupon: coupon.code,
        assignedAt: Date.now(),
      });
      currentIndex = (index + 1) % availableCoupons.length;
      break;
    }
  }

  if (assignedCoupon) {
    socket.emit("couponAssigned", assignedCoupon);

    setTimeout(async () => {
      if (guests.has(socket.id)) {
        const guestData = guests.get(socket.id);
        assignedCoupons.delete(guestData.coupon);
        guests.delete(socket.id);
        socket.emit("couponExpired", { message: "Your coupon has expired" });

        // Assign a new coupon after expiration
        assignCoupon(socket, userId, userIp, io);
      }
    }, COUPON_TIMEOUT);
  } else {
    socket.emit("noCouponsAvailable");
  }

  return io;
}

// export { io };

export const claimCoupon = async (req, res) => {
  //   console.log("Claim");
  //   console.log(req.body);

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

    // console.log("socket", req?.io);

    if (req.io) {
      req.io.emit("couponClaimed", {
        couponId,
        message: `🎉 Coupon ${coupon.code} claimed!`,
      });
      //   console.log("emit - couponClaimed");
    } else {
      console.error("❌ Socket.io is NOT attached to request.");
    }

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
