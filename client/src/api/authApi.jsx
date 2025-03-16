import axios from "axios";

// Set up base URL for the API
const API_BASE_URL = `${import.meta.env.VITE_SERVER_URL}/api/auth`;

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
    // console.log({ response });

    return response.data;
  } catch (error) {
    let data = error.response.data;
    console.log({ data });
    throw error.response.data.message || "Registration failed";
  }
};
