import { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/coupons")
      .then((res) => setCoupons(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Admin Panel</h2>
      <ul>
        {coupons.map((coupon) => (
          <li key={coupon._id}>
            {coupon.code} - {coupon.isClaimed ? "Claimed" : "Available"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
