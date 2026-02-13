


import axios from "axios";
import { API_URLS } from "../config/apiUrls";


// User Service / Gateway
const adminApi = axios.create({
  baseURL: API_URLS.USER, 
});

const CAR_SERVICE_URL = API_URLS.CAR;
const BOOKING_SERVICE_URL = API_URLS.BOOKING; 
const BIKE_SERVICE_URL = API_URLS.BIKE;

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- User Management (Port 8083) ---
export const getAllUsers = () => adminApi.get("/api/users/admin/users");
export const toggleUserStatus = (userId) => adminApi.put(`/api/users/admin/users/${userId}/toggle-status`);
export const updateUserRole = (userId, role) => adminApi.put(`/api/users/admin/users/${userId}/role`, null, { params: { role } });

// --- Vehicle Approvals (Specific Ports) ---
export const fetchPendingCars = () => {
    const config = { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } };
    return axios.get(`${CAR_SERVICE_URL}/api/cars/admin/pending`, config);
};

export const fetchPendingBikes = () => {
    const config = { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } };
    return axios.get(`${BIKE_SERVICE_URL}/api/bikes/admin/pending`, config);
};

export const getPendingVehicles = async () => {
  const token = localStorage.getItem("accessToken");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const cars = await axios.get(`${API_URLS.CAR}/api/cars/admin/pending`, config);
  const bikes = await axios.get(`${API_URLS.BIKE}/api/bikes/admin/pending`, config);

  return { cars: cars.data, bikes: bikes.data };
};

// --- Booking & Refund Management (Port 8082) ---
// FIXED: Using adminApi instance to ensure token interceptor is applied
export const getAllBookings = () => {
  const token = localStorage.getItem("accessToken");
  return axios.get(`${API_URLS.BOOKING}/api/bookings/admin/all`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const processRefund = (bookingId, amount) => {
  const formattedAmount = Number(amount).toFixed(2); // ✅ "99.00"

  return adminApi.post(
    `/api/bookings/admin/refund/${bookingId}`,
    null,
    { params: { amount: formattedAmount } }
  );
};


export const updateVehicleStatus = async (type, id, status, reason = "") => {
    const config = { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } };
    const url = type === 'car' ? `${CAR_SERVICE_URL}/api/cars/admin/approve/${id}` : `${BIKE_SERVICE_URL}/api/bikes/admin/approve/${id}`;
    return await axios.put(url, {}, { 
        ...config, 
        params: { status, reason } 
    });
};


export default adminApi;