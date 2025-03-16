import axios from "axios";

// Set up base URL for the API
const API_BASE_URL = `${import.meta.env.VITE_SERVER_URL}/api/admin`;

// Create an Axios instance with default headers
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to get auth token and attach it to requests
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  return { Authorization: `Bearer ${token}` };
};

// Handle API errors
const handleError = (error) => {
  console.error("API Error:", error);
  throw error.response?.data?.message || "An error occurred";
};

// Add a new coupon
export const addNewCoupon = async (couponData) => {
  try {
    const response = await apiClient.post("/add", couponData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get all coupons
export const getAllCoupons = async () => {
  try {
    const response = await apiClient.get("/", {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Update a coupon
export const updateCoupon = async (couponId, couponData) => {
  try {
    const response = await apiClient.put(`/update/${couponId}`, couponData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
