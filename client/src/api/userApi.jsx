import conf from "../conf/conf.js";
import axios from "axios";

// Set up base URL for the API
const API_BASE_URL = `${conf.server_url}/api/user`;

export const fetchUserProfile = async () => {
  //   console.log("fetching user Profile");
  try {
    const token = localStorage.getItem("token");
    // console.log({ token });

    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await axios.get(`${API_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log({ response });

    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to fetch profile";
  }
};
