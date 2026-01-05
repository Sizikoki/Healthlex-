import axios from "axios";
import { getAccessToken } from "@/utils/storage";

// ✅ ÖNEMLİ: Sonuna /api ekledik çünkü backend tüm rotaları bu ekle bekliyor.
const API_BASE_URL =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
    process.env.REACT_APP_API_BASE_URL ||
    "https://healthlex-back.onrender.com/api"; // BURAYA /api EKLENDİ

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

// ✅ Hata ayıklama için: Hangi tam URL'ye istek atıldığını net görelim
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const fullUrl = error.config ? `${error.config.baseURL}${error.config.url}` : "Bilinmiyor";
        if (error.response?.status === 404) {
            console.error("❌ 404 HATASI: Gidilmeye çalışılan tam adres yanlış:", fullUrl);
        }
        return Promise.reject(error);
    }
);