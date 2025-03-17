# 🎟️ Real-Time Coupon Management System

# Round-Robin-Coupon-Distribution

A real-time coupon management system built with React, Node.js, and WebSockets. Users can claim coupons, receive live updates, and track available/claimed coupons. The system ensures fair distribution, prevents duplicate claims, and automatically manages coupon expiration.

## 🚀 Features

- **🔄 Fair Rotation:** Coupons are assigned in a round-robin manner to ensure fair distribution.
- **⏳ Auto De-assignment:** Coupons are automatically released after 30 seconds if unclaimed.
- **🎟️ Instant Reassignment:** Expired coupons are immediately reassigned to the next user in line.
- **💻 Real-Time Updates:** WebSocket integration for instant coupon status updates.
- **🔐 Authentication:** Secure user login system with JWT authentication.
- **📊 Live User Count:** Displays the number of active users on the platform.
- **✅ Instant Notifications:** Users receive real-time notifications for claimed or available coupons.
- **📡 Efficient Disconnection Handling:** Automatically releases coupons if a user disconnects.

## 🛠️ Tech Stack

- **Frontend:** React.js (Vite, Tailwind CSS, Axios, React Router)
- **Backend:** Node.js (Express.js, Mongoose, JWT)
- **Database:** MongoDB (MongoDB Atlas for cloud storage)
- **WebSocket:** Socket.IO for real-time communication
- **Security:** JSON Web Token (JWT) for authentication
- **Abuse Prevention:** IP & session-based tracking to prevent multiple claims
- **Deployment:** Vercel (Frontend), Render/Vercel (Backend)

## 📌 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/RyomenDev/Round-Robin-Coupon-Distribution
   cd Round-Robin-Coupon-Distribution
   ```

2. **Install dependencies:**

   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

3. **Start the backend server:**

   ```bash
   cd server
   npm run dev
   ```

4. **Start the frontend:**

   ```bash
   cd client
   npm run dev
   ```

5. **Open your browser:**
   - Visit `http://localhost:5173` to access the application.

## 📡 WebSocket Events

### **Client → Server Events**

| Event Name    | Description                              |
| ------------- | ---------------------------------------- |
| `pageReached` | Triggered when a user lands on the page. |
| `claimCoupon` | Requests a coupon assignment.            |

### **Server → Client Events**

| Event Name           | Description                                  |
| -------------------- | -------------------------------------------- |
| `couponAssigned`     | Assigns a coupon to a user.                  |
| `couponExpired`      | Notifies a user when their coupon expires.   |
| `updateUserCount`    | Updates the live count of active users.      |
| `noCouponsAvailable` | Informs users when no coupons are available. |

## 🏢 Future Enhancements

- 🎯 **Expiration Countdown:** Display a timer for assigned coupons.
- 📢 **Admin Dashboard:** Manage coupons, track claims, and view analytics.
- 💌 **Email Notifications:** Notify users via email when they claim a coupon.
- 📊 **Detailed Analytics:** Insights into coupon claim trends and user behavior.

## 📝 License

This project is licensed under the MIT License.

---

🚀 **Happy Coding!** 🎉
