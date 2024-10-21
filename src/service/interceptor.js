import axios from "axios";
import { getItem, setAuthTokenExpiry, setItem } from "../utils/localStorage";
import { handleUnauthorizedRedirect } from "../utils";

const backendURL =
  process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: backendURL, // Set your base URL
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
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
    if (response.headers?.authorization) {
      setItem("authToken", response.headers?.authorization);
      setAuthTokenExpiry();
    }
    return response;
  },
  async (error) => {
    if (error.response) {
      const originalRequest = error.config;

      if (error.response.status === 401) {
        const refreshToken = getItem("refreshToken");

        if (refreshToken) {
          try {
            // Create a clone of the original request
            const updatedRequest = {
              ...originalRequest, // Clone the original request object
              headers: {
                ...originalRequest.headers, // Clone the headers
                authorization: `Bearer ${refreshToken}`, // Set the refreshToken in the headers
              },
            };

            // Retry the original request with the updated headers

            const retryResponse = await axiosInstance.request(updatedRequest);
            return retryResponse;
          } catch (retryError) {
            console.log("Retry Error: ", retryError);
          }
        } else {
          handleUnauthorizedRedirect();
        }
        // Optionally, you could retry the request here
      }
      if (error.response.status === 403) {
        // Handle forbidden error
        handleUnauthorizedRedirect();
      }
    }
    // Handle any other errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
