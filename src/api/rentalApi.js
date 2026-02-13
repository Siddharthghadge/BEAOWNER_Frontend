import axios from "axios";
import { API_URLS } from "@/config/apiUrls";

/**
 * Helper to get auth headers dynamically.
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

// --- PUBLIC METHODS (Updated to include Auth Headers for RBAC) ---

/**
 * Fetches all rentals. Added AuthHeaders so owner names can be resolved by backend.
 */
export const getAllRentals = async () => {
  const res = await axios.get(
    `${API_URLS.RENTALS}/api/categories/category/all`,
    getAuthHeaders()
  );
  return res.data;
};

/**
 * Fetches rentals by category with auth.
 */
export const getRentalsByCategory = async (categoryName) => {
  const res = await axios.get(
    `${API_URLS.RENTALS}/api/categories/category/${categoryName}`,
    getAuthHeaders()
  );
  return res.data;
};

export const getRentalCategories = async () => {
  const res = await axios.get(`${API_URLS.RENTALS}/api/categories`);
  return res.data;
};

/**
 * ✅ CRITICAL FIX: Added getAuthHeaders() here.
 * Without this, the Rental Service receives NO token, 
 * so it cannot forward anything to the User Service.
 */
export const getRentalById = async (id) => {
  const res = await axios.get(
    `${API_URLS.RENTALS}/api/rentals/${id}`,
    getAuthHeaders()
  );
  return res.data;
};

// --- OWNER METHODS ---

/**
 * Fetches items belonging to the logged-in owner.
 */
export const getOwnerRentals = async () => {
  const res = await axios.get(
    `${API_URLS.RENTALS}/api/owner/rentals/my-items`, 
    getAuthHeaders()
  );
  return res.data;
};

/**
 * Handles creation of listings (Support for Multipart/Form-Data)
 */
export const createRentalItem = async (formData) => {
  const res = await axios.post(
    `${API_URLS.RENTALS}/api/owner/rentals`, 
    formData, 
    getAuthHeaders()
  );
  return res.data;
};

/**
 * Updates an existing rental item
 */
export const updateRentalItem = async (id, formData) => {
  const res = await axios.put(
    `${API_URLS.RENTALS}/api/owner/rentals/${id}`, 
    formData, 
    getAuthHeaders()
  );
  return res.data;
};

/**
 * Deletes a rental item
 */
export const deleteRentalItem = async (id) => {
  const res = await axios.delete(
    `${API_URLS.RENTALS}/api/owner/rentals/${id}`, 
    getAuthHeaders()
  );
  return res.data;
};