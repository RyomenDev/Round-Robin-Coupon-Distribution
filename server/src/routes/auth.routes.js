import express from "express";
import {
  registerUser,
  loginUserWithEmail,
} from "../controllers/auth.controller.js";
// import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected Route - Login Route
router.post("/register", registerUser);
router.post("/login", loginUserWithEmail);

export default router;
