import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: String,
  password: String, // Hashed password
});

export default mongoose.model("Admin", adminSchema);
