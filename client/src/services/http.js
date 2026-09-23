import axios from 'axios';
import { getAuthToken } from '@/services/auth-storage';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
let unauthorizedHandler = null;

export const http = axios.create({
    baseURL,
    timeout: 10000,
});

http.interceptors.request.use((config) => {
    const token = getAuthToken();

    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof unauthorizedHandler === 'function') {
            unauthorizedHandler();
        }

        return Promise.reject(error);
    }
);

export function setUnauthorizedHandler(handler) {
    unauthorizedHandler = handler;
}
