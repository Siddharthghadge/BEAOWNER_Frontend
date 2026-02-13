


import bookingApi from "./bookingApi";
//import { API_URLS } from "../config/apiUrls";


const BASE_URL = "/api/bookings";

const bookingService = {

  // ---------------- CREATE BOOKING ----------------
  createBooking: (data) => {
    const token = localStorage.getItem("accessToken");
    return bookingApi.post(BASE_URL, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // ---------------- GET MY BOOKINGS (CUSTOMER) ----------------
  getMyBookings: () => {
    const token = localStorage.getItem("accessToken");
    return bookingApi.get(`${BASE_URL}/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // ---------------- GET BOOKING BY ID ----------------
  getBookingById: (id) => {
    const token = localStorage.getItem("accessToken");
    return bookingApi.get(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // ---------------- CANCEL BOOKING ----------------
  cancelBooking: (id) => {
    const token = localStorage.getItem("accessToken");
    return bookingApi.put(`${BASE_URL}/${id}/cancel`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // ---------------- CONFIRM BOOKING ----------------
  confirmBooking: (id, txnId) => {
    const token = localStorage.getItem("accessToken");
    return bookingApi.post(
      `${BASE_URL}/${id}/confirm`,
      null,
      {
        params: { paymentTxnId: txnId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // ---------------- ✅ GET OWNER BOOKINGS (FIXED) ----------------
  getOwnerBookings: () => {
    const token = localStorage.getItem("accessToken");
    return bookingApi.get(`${BASE_URL}/owner`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // ---------------- VERIFY PICKUP OTP ----------------
  verifyPickupOtp: (bookingId, otp) => {
    const token = localStorage.getItem("accessToken");
    return bookingApi.post(
      `${BASE_URL}/${bookingId}/verify-otp`,
      null,
      {
        params: { otp },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};

export default bookingService;
