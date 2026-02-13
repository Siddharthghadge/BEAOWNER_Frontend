

import axios from "axios";
import { API_URLS } from "../config/apiUrls";


// ✅ Single Axios instance for Payment Service
const paymentApi = axios.create({
  baseURL: `${API_URLS.PAYMENT}/api/payments`,
});

// ✅ Always attach token automatically
paymentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const paymentService = {
  // ✅ ---------------- PAYMENT APIs ----------------

  // ✅ Initiate Payment (Razorpay Order Create)
  initiatePayment: (bookingId, amount) =>
    paymentApi.post("/initiate", { bookingId, amount }),

  // ✅ Verify Payment
  verifyPayment: (paymentData) =>
    paymentApi.post("/verify", paymentData),

  // ✅ ---------------- WALLET APIs ----------------

  // 1. Fetch wallet balance
  getWalletBalance: (email) =>
    paymentApi.get(`/wallet/balance/${encodeURIComponent(email)}`),

  // 2. Fetch full transaction history
  getTransactionHistory: (email) =>
    paymentApi.get(`/wallet/transactions/${encodeURIComponent(email)}`),

  // 3. Fetch wallet summary
  getWalletSummary: (email) =>
    paymentApi.get(`/wallet/summary/${encodeURIComponent(email)}`),

  // 4. Withdraw Funds
  withdrawFunds: (email, amount) =>
    paymentApi.post("/wallet/withdraw", null, {
      params: {
        ownerEmail: email,
        amount: amount,
      },
    }),

  // 5. Update Bank Details
  updateBankDetails: (email, bankData) =>
    paymentApi.put("/wallet/update-bank", bankData, {
      params: { ownerEmail: email },
    }),
};

export default paymentService;
