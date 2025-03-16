# 🎟️ Real-Time Coupon Management System

# Round-Robin-Coupon-Distribution

A real-time coupon management system built with React, Node.js, and WebSockets. Users can claim coupons, receive live updates, and track available/claimed coupons. This project ensures an interactive experience with instant notifications and authentication.

## 🚀 Features

- 💻 **Real-Time Updates:** WebSocket integration for instant coupon status updates.
- 🔑 **Authentication:** Secure user login for claiming coupons.
- 🎟️ **Coupon Claiming System:** Users can view and claim available coupons.
- 🟢 **Live User Count:** Displays the number of users active on the page.
- ✅ **Instant Notifications:** When a coupon is claimed, all users get notified dynamically.
- 📊 **Coupon Status Tracking:** View claimed and available coupons in real time.
- 🎨 **Responsive UI:** Modern and user-friendly interface with Tailwind CSS.

## 🛠️ Tech Stack

- **Frontend:** React.js (Vite, Tailwind CSS, Axios, React Router)
- **Backend:** Node.js (Express.js, Mongoose)
- **Database:** MongoDB
- **Authentication:** JSON Web Token (JWT) for Admin
- **Abuse Prevention:** IP & Cookie-based tracking (Express-session, Rate-Limiter)
- **Deployment:** Vercel (Frontend), Render/Vercel (Backend), MongoDB Atlas (Database)

## 📌 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/RyomenDev/Round-Robin-Coupon-Distribution
   cd Round-Robin-Coupon-Distribution
   ```

2. Install dependencies for both frontend and backend:

   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

3. Start the backend server:

   ```bash
   cd server
   npm run dev
   ```

4. Start the frontend:

   ```bash
   cd client
   npm run dev
   ```

5. Visit `http://localhost:5173` (or your frontend port) in the browser.

## 📼 WebSocket Events

- **Client → Server**

  - `pageReached`: Notifies server when a user lands on the page.
  - `claimCoupon`: Sends a request to claim a coupon.

- **Server → Client**
  - `couponAssigned`: Assigns a coupon to a user.
  - `couponClaimed`: Notifies all users when a coupon is claimed.
  - `updateUserCount`: Sends real-time online user count.

## 🏢 Future Enhancements

- 🎯 Coupon expiration countdown.
- 📢 Admin dashboard for managing coupons.
- 💎 Email notifications for claimed coupons.

## 📝 License

This project is licensed under the MIT License.

---

🎉 Happy Coding!
