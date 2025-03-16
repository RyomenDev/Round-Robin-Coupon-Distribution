import express from "express";

const router = express.Router();

import {
  addNewCoupon,
  updateCoupon,
  getAllCoupon,
} from "../controllers/admin.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

router.post("/add", verifyToken, addNewCoupon);
router.put("/update/:id", verifyToken, updateCoupon);
router.get("/", verifyToken, getAllCoupon);

export default router;
