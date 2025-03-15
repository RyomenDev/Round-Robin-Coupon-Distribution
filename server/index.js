import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";

import couponRoutes from "./src/routes/couponRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.use("/api/coupons", couponRoutes);
app.use("/api/admin", adminRoutes);


app.listen(5000, () => console.log("Server running on port 5000"));
