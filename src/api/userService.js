import axios from "axios";
import { API_URLS } from "../config/apiUrls";


const userApi = axios.create({
  baseURL: API_URLS.USER,
});

// Attach the JWT token for the verification check
userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const userService = {
  // This calls the backend to check if 'isVerified' is true
  getProfile: () => userApi.get("/me"),
};

export default userService;