import axios from 'axios';
import { API_URLS } from "../config/apiUrls";


const bikeApi = axios.create({
    baseURL: `${API_URLS.BIKE}/api/bikes`, 
});

bikeApi.interceptors.request.use((config) => {
    // ✅ FIX: Changed 'token' to 'accessToken' to match your Login.jsx
    const token = localStorage.getItem('accessToken'); 
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Helper functions
export const getAllBikes = () => bikeApi.get(''); 
export const getBikeById = (id) => bikeApi.get(`/${id}`);

export default bikeApi;