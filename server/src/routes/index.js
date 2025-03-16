import express from "express";
const router = express.Router();

import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";

import couponRoutes from "./coupon.routes.js";

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/coupons", couponRoutes);

export default router;
