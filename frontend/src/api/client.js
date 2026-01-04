import axios from "axios";
import {
    getAccessToken,
    getRefreshToken,
    setTokens,
    clearTokens,
} from "@/utils/storage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// =====================
// REQUEST INTERCEPTOR
// =====================
api.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// =====================
// RESPONSE INTERCEPTOR
// =====================

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
    failedQueue.forEach((p) => {
        if (error) p.reject(error);
        else p.resolve(token);
    });
    failedQueue = [];
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // access token expired → refresh dene
        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            if (isRefreshing) {
                // refresh devam ediyorsa kuyruğa al
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(api(originalRequest));
                        },
                        reject,
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = getRefreshToken();
                if (!refreshToken) {
                    throw new Error("No refresh token");
                }

                const res = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    { refresh_token: refreshToken },
                    { headers: { "Content-Type": "application/json" } }
                );

                setTokens(res.data);
                processQueue(null, res.data.access_token);

                originalRequest.headers.Authorization =
                    `Bearer ${res.data.access_token}`;

                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                clearTokens();
                window.location.href = "/login";
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
