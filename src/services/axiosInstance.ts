// src/services/axiosInstance.ts
import axios from 'axios';
import { authService } from './authService';

const axiosInstance = axios.create({
    baseURL: 'https://api-servi-net.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = authService.getToken();
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
