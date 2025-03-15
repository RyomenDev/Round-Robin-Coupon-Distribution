import conf from "../conf/conf.js";
import axios from "axios";

// Set up base URL for the API
const API_BASE_URL = `${conf.server_url}/api/auth`;

export const loginUser = async (email, password) => {
  //   console.log({ email, password });

  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });
    // console.log({ response });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed";
  }
};

export const registerUser = async (name, email, password) => {
  //   console.log({ name, email, password });
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      name,
      email,
      password,
    });
    console.log({ response });

    // return response.data;
  } catch (error) {
    let data = error.response.data;
    console.log({ data });
    throw error.response.data.message || "Registration failed";
  }
};

export const ResetPassword = async (newPassword) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.post(
      `${API_BASE_URL}/resetPassword`,
      { newPassword }, // Body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log({ response });

    return response.data;
  } catch (error) {
    console.error("Reset Password Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to reset password"
    );
  }
};
