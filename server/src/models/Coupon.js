import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  expirationDate: { type: Date, required: true },
  isClaimed: { type: Boolean, default: false },
  claimedBy: { type: String, default: null }, // Store IP or session ID
});

export default mongoose.model("Coupon", couponSchema);

