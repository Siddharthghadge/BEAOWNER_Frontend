// src/api/baseApi.js
import axios from "axios";
import { API_URLS } from "../config/apiUrls";


const baseApi = axios.create({
  withCredentials: true,
});

// 🔐 Attach access token
baseApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      if (!config.headers) config.headers = {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 Refresh token handling
baseApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔴 Forbidden → no retry
    if (error.response?.status === 403) {
      console.error("403 Forbidden – role/permission issue");
      return Promise.reject(error);
    }

    // 🔁 Token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("accessToken")
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
         "/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        localStorage.setItem("accessToken", res.data.accessToken);
        originalRequest.headers.Authorization =
          "Bearer " + res.data.accessToken;

        return baseApi(originalRequest);
      } catch (refreshErr) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default baseApi;
