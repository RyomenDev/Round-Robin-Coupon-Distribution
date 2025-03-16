import { useState, useEffect } from "react";
import { addNewCoupon, updateCoupon } from "../../api";

const AdminCouponForm = ({ editCoupon, onSuccess }) => {
  const [code, setCode] = useState(editCoupon?.code || "");
  const [discount, setDiscount] = useState(editCoupon?.discount || "");
  const [expirationDate, setExpirationDate] = useState(
    editCoupon?.expirationDate?.split("T")[0] || ""
  );

  useEffect(() => {
    if (editCoupon) {
      setCode(editCoupon.code);
      setDiscount(editCoupon.discount);
      setExpirationDate(editCoupon.expirationDate.split("T")[0]);
    }
  }, [editCoupon]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const couponData = { code, discount, expirationDate };

    try {
      if (editCoupon) {
        await updateCoupon(editCoupon._id, couponData);
      } else {
        await addNewCoupon(couponData);
      }
      alert("Coupon saved successfully!");
      onSuccess();
    } catch (error) {
      alert("Error saving coupon", error.message);
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
        {/* Dark Overlay */}
        {/* <div className="absolute inset-0 bg-black bg-opacity-50"></div> */}

        <div className="relative bg-white p-8 shadow-xl rounded-xl w-full max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {editCoupon ? "Edit Coupon" : "Add Coupon"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Coupon Code Input */}
            <div>
              <label className="block text-gray-700 font-medium">
                Coupon Code
              </label>
              <input
                type="text"
                placeholder="Enter Coupon Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Discount Input */}
            <div>
              <label className="block text-gray-700 font-medium">
                Discount (%)
              </label>
              <input
                type="number"
                placeholder="Enter Discount"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Expiration Date Input */}
            <div>
              <label className="block text-gray-700 font-medium">
                Expiration Date
              </label>
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              {editCoupon ? "Update" : "Add"} Coupon
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminCouponForm;
