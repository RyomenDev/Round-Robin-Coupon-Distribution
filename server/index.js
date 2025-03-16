import cors from "cors";
import connectDB from "./src/config/db.js";
import { app } from "./src/app.js";
import http from "http";
import { initializeSocket } from "./src/controllers/coupon.controller.js"; // Import WebSocket logic
import conf from "./conf.js";

const server = http.createServer(app);
const io = initializeSocket(server); // Initialize Socket.io

const PORT = conf.PORT || 5000;

// Start the server
const startServer = async () => {
  try {
    await connectDB();
    // app.listen(PORT, () => {
    //   console.log(`⚙️ Server is running at port: ${PORT}`);
    // });
    server.listen(PORT, () => {
      console.log(`⚙️ Server is running at port: ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
  }
};

startServer();
