import { useState, useEffect } from "react";
import { claimSingleCoupon, getCoupons } from "../../api";
import { io } from "socket.io-client";

const CouponClaim = () => {
  const [message, setMessage] = useState("");
  const [coupons, setCoupons] = useState([]); // Store all coupons
  const [userCount, setUserCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [assignedCoupon, setAssignedCoupon] = useState("");

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

    newSocket.on("couponAssigned", (assignedCoupon) => {
      //   console.log(assignedCoupon);
      setAssignedCoupon(assignedCoupon);
    });

    newSocket.on("updateUserCount", (count) => {
      fetchCoupons();
      //   console.log("Updated User Count:", count);
      setUserCount(count);
    });

    // Listen for 'couponClaimed' event from server
    newSocket.on("couponClaimed", ({ couponId, message }) => {
      console.log({ couponId, message });
      //   setMessage(message);
      //   setCoupons((prevCoupons) =>
      //     prevCoupons?.map((coupon) =>
      //       coupon._id === couponId ? { ...coupon, isClaimed: true } : coupon
      //     )
      //   );
      //   setCoupons((prevCoupons) =>
      //     prevCoupons?.map((coupon) => {
      //       if (coupon._id === couponId) {
      //         setMessage(message); // Only set message when the correct coupon is updated
      //         return { ...coupon, isClaimed: true };
      //       }
      //       return coupon;
      //     })
      //   );
      console.log(
        "assignedCoupon._id : couponId =",
        assignedCoupon._id,
        couponId
      );

      if (assignedCoupon._id === couponId) {
        setMessage(message);
      }
      console.log({ coupons });
    });
    // newSocket.on("couponClaimed", ({ couponId, message }) => {
    //   console.log({ couponId, message });
    // });

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
      console.error(error);
      setMessage(error || "Error claiming coupon");
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
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#4e2e24] via-[#91847e] to-[#523838] p-6">
        <p className="text-xl text-white font-semibold">
          {userCount} users online
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg text-center mt-6">
          <h2 className="text-xl font-bold text-gray-800">
            🎟️ Your Coupon Code:
          </h2>
          <p className="text-3xl text-green-600 font-bold my-3">
            {assignedCoupon.code || "Assigning..."}
          </p>
          <button
            onClick={() => claimCoupon(assignedCoupon._id)}
            className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
          >
            Claim
          </button>
          <p className="text-green-600 font-semibold mt-2">{message}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-3xl mt-10">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            🎟️ Available & Claimed Coupons
          </h2>

          {/* Available Coupons */}
          <h3 className="text-2xl font-semibold text-green-700">
            🟢 Available Coupons
          </h3>
          {availableCoupons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {availableCoupons.map((coupon) => (
                <div
                  key={coupon._id}
                  className="bg-green-100 p-4 rounded-lg shadow-md hover:scale-105 transition"
                >
                  <strong className="text-lg text-gray-900">
                    {coupon.code}
                  </strong>
                  <p className="text-gray-700">{coupon.discount}% off</p>
                  <small className="text-gray-500">
                    Expires: {new Date(coupon.expirationDate).toDateString()}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No available coupons.</p>
          )}

          {/* Claimed Coupons */}
          <h3 className="text-2xl font-semibold text-purple-700 mt-8">
            ✅ Claimed Coupons
          </h3>
          {claimedCoupons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {claimedCoupons.map((coupon) => (
                <div
                  key={coupon._id}
                  className="bg-gray-100 p-4 rounded-lg shadow-md hover:scale-105 transition"
                >
                  <strong className="text-lg text-gray-900">
                    Code: {coupon.code}
                  </strong>
                  <p className="text-gray-700">{coupon.discount}% off</p>
                  <small className="text-gray-500">
                    Expires: {new Date(coupon.expirationDate).toDateString()}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No claimed coupons yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CouponClaim;
