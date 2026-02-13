import axios from "axios";
import { API_URLS } from "../config/apiUrls";


const authApi = axios.create({
  baseURL: API_URLS.AUTH, // auth-service
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ✅ Use the instance (authApi) instead of raw axios
// ✅ Use template literals to append the path to the baseURL automatically
export const forgotPassword = async (email) => {
    return await authApi.post(`/api/auth/forgot-password?email=${email}`);
};

export const resetPassword = async (resetData) => {
    // resetData = { email, token, newPassword }
    return await authApi.post("/api/auth/reset-password", resetData);
};

export default authApi;