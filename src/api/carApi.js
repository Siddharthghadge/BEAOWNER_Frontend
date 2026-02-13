
import axios from "axios";
import { API_URLS } from "../config/apiUrls";


const carApi = axios.create({
  baseURL: API_URLS.CAR,
});

// ✅ Automatically attach JWT to every request
carApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default carApi;