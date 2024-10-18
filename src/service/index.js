import { getItem } from "../utils/localStorage";
import axiosInstance from "./interceptor";

export const validateAuthToken = async () => {
  try {
    const response = await axiosInstance.get("/validated-auth-token", {
      headers: {
        authorization: getItem("authToken"), // Override or add token
      },
    });
    return response?.status;
  } catch (error) {
    throw error;
  }
};
export const getUserInfo = async () => {
  try {
    const response = await axiosInstance.get(`protected/userid`, {
      headers: {
        authorization: getItem("authToken"), // Override or add token
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
