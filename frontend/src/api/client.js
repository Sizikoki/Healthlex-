import axios from "axios";
import { getAccessToken } from "@/utils/storage";

// ✅ CRA + Vite uyumlu tek çözüm
const API_BASE_URL =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
    process.env.REACT_APP_API_BASE_URL ||
    "https://healthlex-api.onrender.com";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken(); // token (kimlik anahtarı)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
