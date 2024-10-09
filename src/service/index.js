import axiosInstance from "./interceptor";

export const validateAuthToken = async () => {
  try {
    const response = await axiosInstance.get("/validated-auth-token");
    return response?.status;
  } catch (error) {
    throw error;
  }
};
export const getUserInfo = async () => {
  try {
    const response = await axiosInstance.get(`/protected/userid`);
    return response;
  } catch (error) {
    throw error;
  }
};
