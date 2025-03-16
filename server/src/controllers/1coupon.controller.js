import Coupon from "../models/Coupon.js";
import { User } from "../models/user.model.js";

const claimHistory = new Map(); // Tracks claims (IP & Session)
const claimCooldown = 300 * 1000; // 1-minute cooldown

export const claimCoupon = async (req, res) => {
  try {
    // Extract client IP (handles proxies)
    const clientIp =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    // console.log("Client IP:", clientIp);

    // Extract session ID from cookies or create a new one
    let userSession = req.cookies.sessionId;
    if (!userSession) {
      userSession = Date.now().toString();
      res.cookie("sessionId", userSession, {
        maxAge: claimCooldown,
        httpOnly: true,
      });
    }

    // Prevent multiple claims within cooldown period
    if (claimHistory.has(clientIp) || claimHistory.has(userSession)) {
      return res
        .status(429)
        .json({ message: "❌ Try again later after 5 minutes." });
    }

    const { couponId } = req.body;

    // Validate coupon ID
    if (!couponId) {
      return res.status(400).json({ message: "Coupon ID is required!" });
    }

    // Find the specific coupon by ID and check if it's available
    const coupon = await Coupon.findOne({
      _id: couponId,
      isClaimed: false,
    });

    if (!coupon) {
      return res
        .status(400)
        .json({ message: "This coupon is unavailable or already claimed!" });
    }

    // Claim the specific coupon
    coupon.isClaimed = true;
    coupon.claimedBy = clientIp;
    coupon.claimedIp = clientIp;
    coupon.claimedAt = new Date();
    await coupon.save();

    // Store claim history
    claimHistory.set(clientIp, true);
    claimHistory.set(userSession, true);

    res.json({ message: `🎉 Coupon claimed: ${coupon.code}`, coupon });
  } catch (error) {
    console.error("Error claiming coupon:", error);
    res.status(500).json({ message: "Failed to claim coupon." });
  }
};

// View Available & self claimed Coupons  (USER)

export const getAllCoupon = async (req, res) => {
  // console.log("all coupons", req.userId);

  try {
    // Get user details
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    // console.log({user});

    let coupons;

    if (user.userType === "Admin") {
      // Admin: Fetch all coupons
      coupons = await Coupon.find();
    } else {
      // User: Fetch only available and self-claimed coupons
      coupons = await Coupon.find({
        $or: [{ isClaimed: false }, { claimedBy: req.ip }],
      }).select("code discount expirationDate isClaimed claimedBy");
    }
    // console.log({ coupons });

    res.json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ error: "Failed to fetch coupons." });
  }
};

// Admin View Coupons
// router.get("/", async (req, res) => {
//   const coupons = await Coupon.find();
//   res.json(coupons);
// });
