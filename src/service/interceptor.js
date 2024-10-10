import axios from "axios";
import {
  clearStorage,
  getItem,
  setAuthTokenExpiry,
  setItem,
} from "../utils/localStorage";

const backendURL =
  process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: backendURL, // Set your base URL
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth tokens from localStorage to headers
    config.headers.auth_token = getItem("authToken");
    config.headers.refresh_token = getItem("refreshToken");
    return config;
  },
  (error) => {
    // Handle the error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Check for new auth_token in response headers and update localStorage if present
    if (response.headers?.auth_token) {
      setItem("authToken", response.headers?.auth_token);
      setAuthTokenExpiry();
    }
    return response;
  },
  async (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Handle unauthorized error
        // Optionally, you could retry the request here
        return axiosInstance.request(error.config); // Retry the original request
      }
      if (error.response.status === 403) {
        // Handle forbidden error
        window.location.href = "/";
        clearStorage();
        setItem("reload", true);
      }
    }
    // Handle any other errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
