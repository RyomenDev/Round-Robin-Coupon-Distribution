import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import { app } from "./src/app.js";
import conf from "./conf.js";

const PORT = conf.PORT || 5000;

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`⚙️ Server is running at port: ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
  }
};

startServer();
