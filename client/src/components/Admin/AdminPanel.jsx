import { useState, useEffect } from "react";
import AdminCouponForm from "./AdminCouponForm";
import { getAllCoupons } from "../../api";

const AdminPanel = () => {
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const data = await getAllCoupons();
      //   console.log("Fetched Coupons:", data);
      setCoupons(data);
      //   setCoupons(Array.isArray(data) ? data : []); // Ensure `data` is an array
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{
          backgroundImage: "url('https://picsum.photos/300/200')",
        }}
      >
        {/* Dark Overlay Effect */}
        {/* <div className="absolute inset-0 bg-black bg-opacity-50"></div> */}

        <div className="relative bg-white p-8 shadow-lg rounded-xl w-full max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Manage Coupons
          </h2>

          {/* Coupon Form */}
          <AdminCouponForm
            editCoupon={selectedCoupon}
            onSuccess={() => {
              fetchCoupons();
              setSelectedCoupon(null);
            }}
          />

          {/* Coupon List */}
          <div className="mt-6">
            {coupons.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons?.map((coupon) => (
                  <li
                    key={coupon._id}
                    className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center"
                  >
                    <div>
                      <p className="text-lg font-semibold">
                        {coupon.code} - {coupon.discount}% OFF
                      </p>
                      <p className="text-gray-600">
                        Expires:{" "}
                        {new Date(coupon.expirationDate).toDateString()}
                      </p>
                      <p
                        className={`text-sm font-semibold ${
                          coupon.isClaimed ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {coupon.isClaimed
                          ? `Claimed by ${coupon.claimedBy}`
                          : "Not Claimed"}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedCoupon(coupon)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                      Edit
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">No coupons available</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
// export default AdminCouponList;
