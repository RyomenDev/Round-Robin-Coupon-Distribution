import { useState, useEffect } from "react";
import { claimSingleCoupon, getCoupons } from "../../api";
import { io } from "socket.io-client";

const CouponClaim = () => {
  const [message, setMessage] = useState("");
  const [coupons, setCoupons] = useState([]); // Store all coupons
  const [userCount, setUserCount] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found");
      return; // Prevent WebSocket connection if no token
    }
    // console.log({ token });

    // Check if WebSocket is already initialized
    if (socket) return;

    // Initialize WebSocket connection only when component mounts
    const newSocket = io(`${import.meta.env.VITE_SERVER_URL}`, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      transports: ["websocket"],
      auth: { token }, // Send token to server for authentication
      //   query: { token }, // Send token via query parameters
    });

    setSocket(newSocket); // Store the socket instance

    newSocket.on("connect", () => {
      //   console.log("Connected to WebSocket Server");
      newSocket.emit("pageReached", { page: "CouponClaim" }); // Notify server
    });

    newSocket.on("updateUserCount", (count) => {
      fetchCoupons();
      //   console.log("Updated User Count:", count);
      setUserCount(count);
    });

    return () => {
      newSocket.disconnect(); // Disconnect when component unmounts
    };
  }, []);

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
    <>
      <p className="text-xl text-blue-600 font-semibold pl-10">
        {userCount} users online
      </p>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-800 p-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            🎟️ Available & Claimed Coupons
          </h2>
          <p className="text-center text-green-600 font-semibold">{message}</p>

          {/* Available Coupons */}
          <h3 className="text-xl font-semibold mt-6 mb-2 text-green-700">
            🟢 Available Coupons
          </h3>
          {availableCoupons.length > 0 ? (
            <ul className="space-y-3">
              {availableCoupons.map((coupon) => (
                <li
                  key={coupon._id}
                  className="p-4 bg-green-100 rounded-lg shadow-md transition hover:bg-green-200"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <strong className="text-lg text-gray-900">
                        {coupon.code}
                      </strong>
                      <p className="text-gray-700">{coupon.discount}% off</p>
                      <small className="text-gray-500">
                        Expires:{" "}
                        {new Date(coupon.expirationDate).toDateString()}
                      </small>
                    </div>
                    <button
                      onClick={() => claimCoupon(coupon._id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Claim
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No available coupons.</p>
          )}

          {/* Claimed Coupons */}
          <h3 className="text-xl font-semibold mt-6 mb-2 text-purple-700">
            ✅ Claimed Coupons
          </h3>
          {claimedCoupons.length > 0 ? (
            <ul className="space-y-3">
              {claimedCoupons.map((coupon) => (
                <li
                  key={coupon._id}
                  className="p-4 bg-gray-100 rounded-lg shadow-md"
                >
                  <strong className="text-lg text-gray-900">
                    Code: {coupon.code}
                  </strong>
                  <p className="text-gray-700">{coupon.discount}% off</p>
                  <small className="text-gray-500">
                    Expires: {new Date(coupon.expirationDate).toDateString()}
                  </small>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No claimed coupons yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CouponClaim;
