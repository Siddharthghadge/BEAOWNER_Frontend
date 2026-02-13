import carApi from "./carApi";
//import { API_URLS } from "../config/apiUrls";


// Named Exports
export const getAllCars = () => carApi.get("/api/cars/available");
export const getCarById = (id) => carApi.get(`/api/cars/${id}`);

// ✅ NEW: Fetch cars by service type (SELF_DRIVE or WITH_DRIVER)
export const getCarsByType = (type) => carApi.get(`/api/cars/type/${type}`);

const carService = {
  getAllCars,
  getCarById,
  getCarsByType, // ✅ Added to the object
};

// Default Export
export default carService;