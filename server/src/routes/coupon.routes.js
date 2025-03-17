import express from "express";
import { claimCoupon, getAllCoupon } from "../controllers/coupon.controller.js";
import rateLimiter from "../middleware/rateLimiter.middleware.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const claimCooldown = 60 * 1000; // 1 minute cooldown
const router = express.Router();

// Apply rate limiter middleware (1 request per minute)
router.post(
  "/claim",
//   rateLimiter(
//     claimCooldown,
//     1,
//     "❌ You can only claim a coupon once per minute."
//   ),
  claimCoupon
);
router.get("/", verifyToken, getAllCoupon);

// router.post("/some-route", rateLimiter(30000, 5), someController);

export default router;
