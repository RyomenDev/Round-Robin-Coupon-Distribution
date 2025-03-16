import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import conf from "../../conf.js";


const JWT_SECRET = conf.JWT_SECRET;

// Helper function to filter user data (excluding sensitive info)
const filterUserData = (user) => ({
  name: user.name,
  email: user.email,
  userType: user.userType,
});

// User Registration
export const registerUser = async (req, res) => {
  //   console.log("registerUser");

  try {
    const { name, email, password, userType: reqUserType } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
        error: "All fields are required.",
      });
    }

    // Convert email to lowercase
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      //   return res.status(400).json({ message: "User already exists." });
      return res.status(400).json({
        message: "User already exists.",
        error: "User already exists.",
      });
    }

    let finalUserType = reqUserType || "User"; // Default userType is "User"
    const adminEmails = conf.ADMIN_EMAILS?.split(",") || []; // Store admin emails in .env

    if (adminEmails.includes(normalizedEmail)) {
      finalUserType = "Admin";
    }

    // console.log({ finalUserType });

    // Create new user
    const newUser = new User({
      name,
      email: normalizedEmail,
      password, // Raw password, will be hashed in pre-save middleware
      userType: finalUserType,
    });

    await newUser.save();
    return res.status(201).json({
      message: "User registered successfully.",
      user: {
        name: newUser.name,
        email: newUser.email,
        userType: newUser.userType,
      },
    });
    // return res.status(201).json({
    //   message: "User registered successfully.",
    //   user: filterUserData(newUser),
    // });
  } catch (error) {
    console.error("Error registering user:", error.message);
    return res.status(500).json({
      //   message: "Error registering user.",
      message: error.message,
      error: error.message,
    });
  }
};

// User Login (Email & Password)
export const loginUserWithEmail = async (req, res) => {
  //   console.log(req.body);

  try {
    const { email, password } = req.body;
    // console.log({ email, password });
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
        error: "All fields are required",
      });
    }
    // Convert email to lowercase for consistency
    const normalizedEmail = email.toLowerCase();
    // console.log({ normalizedEmail,password });
    const user = await User.findOne({ email: normalizedEmail });
    // console.log({ user });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password.",
        error: "Invalid email or password.",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password.",
        error: "Invalid email or password.",
      });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(200).json({
      message: "Login successful.",
      token,
      user: filterUserData(user),
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({
      // message: "Error logging in.",
      message: error.message,
      error: error.message,
    });
  }
};

export { filterUserData };
