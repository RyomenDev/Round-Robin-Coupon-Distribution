# Round-Robin-Coupon-Distribution

## Project Setup & Structure

### 1️⃣ Tech Stack

- **Frontend:** React.js (Vite, Tailwind CSS, Axios, React Router)
- **Backend:** Node.js (Express.js, Mongoose)
- **Database:** MongoDB
- **Authentication:** JSON Web Token (JWT) for Admin
- **Abuse Prevention:** IP & Cookie-based tracking (Express-session, Rate-Limiter)
- **Deployment:** Vercel (Frontend), Render/Vercel (Backend), MongoDB Atlas (Database)

### 2️⃣ Backend (Express.js, MongoDB)

#### Directory Structure

```
server/
    |──src/
    |   |── models/
    │   │   ├── Coupon.js
    │   │   ├── Admin.js
    │   │── routes/
    │   │   ├── couponRoutes.js
    │   │   ├── adminRoutes.js
    │   │── middleware/
    │   │   ├── authMiddleware.js
    │   │── config/
    │   │   ├── db.js
    │── server.js
    │── .env
```

### 3️⃣ Frontend (React.js)


