
import Coupon from "../models/Coupon.js";
import rateLimit from "express-rate-limit";
import { User } from "../models/user.model.js";

// Create a new coupon
export const addNewCoupon = async (req, res) => {
  try {
    // console.log(req.body, req.userId);

    // Find the user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the user is an Admin
    if (user.userType !== "Admin") {
      return res.status(403).json({ error: "Not authorized. Admins only." });
    }

    // Extract coupon details from request
    const { code, discount, expirationDate } = req.body;

    // Create and save the new coupon
    const newCoupon = new Coupon({ code, discount, expirationDate });
    await newCoupon.save();

    res.status(201).json({ message: "Coupon added successfully!" });
  } catch (error) {
    console.error("Error adding coupon:", error);
    res.status(500).json({ error: "Failed to add coupon." });
  }
};

// Update an existing coupon (Admin only)
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount, expirationDate, isActive } = req.body;

    // Find the user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the user is an Admin
    if (user.userType !== "Admin") {
      return res.status(403).json({ error: "Not authorized. Admins only." });
    }

    // Find and update the coupon
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { code, discount, expirationDate, isActive },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    res.json({ message: "Coupon updated successfully!", updatedCoupon });
  } catch (error) {
    console.error("Error updating coupon:", error);
    res.status(500).json({ error: "Failed to update coupon." });
  }
};

// Admin View Coupons (Admin only)
export const getAllCoupon = async (req, res) => {
  try {
    // Find the user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the user is an Admin
    if (user.userType !== "Admin") {
      return res.status(403).json({ error: "Not authorized. Admins only." });
    }

    // Fetch all coupons
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ error: "Failed to fetch coupons." });
  }
};
