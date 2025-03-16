import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  expirationDate: { type: Date, required: true },
  isClaimed: { type: Boolean, default: false },
  claimedBy: { type: String, default: null },
  claimedIp: { type: String, default: null },
  claimedAt: { type: Date, default: null },
});

export default mongoose.model("Coupon", couponSchema);
