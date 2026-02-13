import axios from 'axios';
import { API_URLS } from "../config/apiUrls";


const bookingApi = axios.create({
  baseURL: API_URLS.BOOKING,
});

bookingApi.interceptors.request.use((config) => {
  // ✅ Check both common keys: "token" and "accessToken"
  const token = localStorage.getItem("token") || localStorage.getItem("accessToken"); 

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("⚠️ NO TOKEN FOUND IN LOCALSTORAGE - REDIRECTING TO LOGIN MIGHT BE NEEDED");
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default bookingApi;