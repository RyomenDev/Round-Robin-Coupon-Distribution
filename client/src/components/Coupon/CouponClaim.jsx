import { useState, useEffect } from "react";
import { claimSingleCoupon, getCoupons } from "../../api";

const CouponClaim = () => {
  const [message, setMessage] = useState("");
  const [coupons, setCoupons] = useState([]); // Store all coupons

  // Fetch coupons (available + claimed by user)
  const fetchCoupons = async () => {
    try {
      const data = await getCoupons();
      //   console.log({ data });

      // Update state with coupons
      setCoupons(data);
    } catch (error) {
      console.error("Error fetching coupons:", error.response?.data);
    }
  };

  // Claim a specific coupon
  const claimCoupon = async (couponId) => {
    try {
      const data = await claimSingleCoupon({ couponId });
      setMessage(data.message);
      fetchCoupons(); // Refresh coupon list after claiming
    } catch (error) {
      console.error(error.response?.data);
      setMessage(
        error?.response?.data.message ||
          error?.response?.data ||
          "Error claiming coupon"
      );
    }
  };

  // Fetch coupons on component mount
  useEffect(() => {
    fetchCoupons();
  }, []);

  // Separate claimed & available coupons
  const claimedCoupons = coupons.filter((coupon) => coupon.isClaimed);
  const availableCoupons = coupons.filter((coupon) => !coupon.isClaimed);

  return (
    <div>
      <h2>🎟️ Available & Claimed Coupons</h2>
      <p>{message}</p>

      <h3>🟢 Available Coupons</h3>
      <ul>
        {availableCoupons.length > 0 ? (
          availableCoupons.map((coupon) => (
            <li key={coupon._id}>
              <strong>{coupon.code}</strong> - {coupon.discount}% off
              <br />
              <small>
                Expires: {new Date(coupon.expirationDate).toDateString()}
              </small>
              <br />
              <button onClick={() => claimCoupon(coupon._id)}>Claim</button>
            </li>
          ))
        ) : (
          <p>No available coupons.</p>
        )}
      </ul>

      <h3>✅ Claimed Coupons</h3>
      <ul>
        {claimedCoupons.length > 0 ? (
          claimedCoupons.map((coupon) => (
            <li key={coupon._id}>
              <strong>{coupon.code}</strong> - {coupon.discount}% off
              <br />
              <small>Code: {coupon.code}</small>
              <br />
              <small>
                Expires: {new Date(coupon.expirationDate).toDateString()}
              </small>
            </li>
          ))
        ) : (
          <p>No claimed coupons yet.</p>
        )}
      </ul>
    </div>
  );
};

export default CouponClaim;
