import axios from "axios";
import { getAccessToken } from "@/utils/storage";

// ✅ Backend adresini senin gerçek Render adresinle güncelledik
const API_BASE_URL =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
    process.env.REACT_APP_API_BASE_URL ||
    "https://healthlex-back.onrender.com"; // BURASI DÜZELTİLDİ

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Hata ayıklama için ekledik: İsteğin nereye gittiğini konsolda gör
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 404) {
            console.error("KRİTİK HATA: Backend adresi bulunamadı! Gidilen adres:", error.config.url);
        }
        return Promise.reject(error);
    }
);