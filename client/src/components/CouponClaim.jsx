import { useState } from "react";
import axios from "axios";

const CouponClaim = () => {
  const [message, setMessage] = useState("");

  const claimCoupon = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/coupons/claim",
        {},
        { withCredentials: true }
      );
      setMessage(data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error claiming coupon");
    }
  };

  return (
    <div>
      <button onClick={claimCoupon}>Claim Coupon</button>
      <p>{message}</p>
    </div>
  );
};

export default CouponClaim;
