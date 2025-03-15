import express from "express";
import Coupon from "../models/Coupon.js";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

const router = express.Router();
router.use(cookieParser());

const claimCooldown = 60 * 1000; // 1 minute cooldown
const claimHistory = new Map();

// IP-Based Rate Limiting
const limiter = rateLimit({
  windowMs: claimCooldown,
  max: 1, // 1 request per minute per IP
  message: "❌ You can only claim a coupon once per minute.",
});

// Create a new coupon
router.post("/add", async (req, res) => {
  try {
    const { code, discount, expirationDate } = req.body;
    const newCoupon = new Coupon({ code, discount, expirationDate });
    await newCoupon.save();
    res.status(201).json({ message: "Coupon added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add coupon." });
  }
});

// Update an existing coupon
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount, expirationDate, isActive } = req.body;
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { code, discount, expirationDate, isActive },
      { new: true }
    );
    if (!updatedCoupon) return res.status(404).json({ error: "Coupon not found" });
    res.json({ message: "Coupon updated successfully!", updatedCoupon });
  } catch (error) {
    res.status(500).json({ error: "Failed to update coupon." });
  }
});

// Claim Coupon
router.post("/claim", limiter, async (req, res) => {
  const userIp = req.ip;
  const userSession = req.cookies.sessionId;

  if (!userSession) {
    res.cookie("sessionId", Date.now().toString(), {
      maxAge: claimCooldown,
      httpOnly: true,
    });
  }

  if (claimHistory.get(userIp) || claimHistory.get(userSession)) {
    return res.status(429).json({ message: "❌ Try again later." });
  }

  const coupon = await Coupon.findOneAndUpdate(
    { isClaimed: false },
    { isClaimed: true, claimedBy: userIp },
    { new: true }
  );

  if (!coupon)
    return res.status(400).json({ message: "No coupons available!" });

  claimHistory.set(userIp, true);
  claimHistory.set(userSession, true);

  res.json({ message: `🎉 Coupon claimed: ${coupon.code}` });
});

// Admin View Coupons
router.get("/", async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
});

export default router;
