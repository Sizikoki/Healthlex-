import axios from "axios";
import {
    getAccessToken,
    getRefreshToken,
    setTokens,
    authLogout,
} from "@/utils/storage";

const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "https://healthlex-back.onrender.com";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// ============================
// REQUEST: Attach access token
// ============================
api.interceptors.request.use(
    (config) => {
        config.headers = config.headers || {};
        const token = getAccessToken?.();
        if (token) config.headers.Authorization = `Bearer ${token}`;
        else delete config.headers.Authorization;
        return config;
    },
    (error) => Promise.reject(error)
);

// ======================================================
// RESPONSE: 401(access) -> refresh -> retry (queue-based)
// ======================================================
let isRefreshing = false;
let refreshQueue = [];

function resolveQueue(error, newAccessToken = null) {
    refreshQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(newAccessToken);
    });
    refreshQueue = [];
}

// refresh isteği: interceptor'a takılmasın diye plain axios ile at
async function refreshAccessToken() {
    const refresh_token = getRefreshToken?.();
    if (!refresh_token) throw new Error("No refresh token");

    console.log('🔄 Refresh token gönderiliyor:', refresh_token.substring(0, 20) + '...');

    const res = await axios.post(
        `${API_BASE_URL}/api/auth/refresh`,
        {}, // BOŞ BODY
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${refresh_token}` // HEADER'DAN GÖNDER
            }
        }
    );

    const access_token = res.data?.access_token;
    const new_refresh_token = res.data?.refresh_token;

    if (!access_token) throw new Error("Refresh did not return access_token");

    console.log('✅ Refresh başarılı! Yeni tokenlar alındı.');

    setTokens({
        access_token,
        refresh_token: new_refresh_token || refresh_token,
    });

    return access_token;
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const originalRequest = error.config;

        if (!originalRequest) return Promise.reject(error);
        if (status !== 401) return Promise.reject(error);

        // refresh endpoint 401 => logout (sonsuz döngü olmasın)
        if (originalRequest.url?.includes("/api/auth/refresh")) {
            console.log('❌ Refresh endpoint 401, logout yapılıyor');
            authLogout();
            return Promise.reject(error);
        }

        // aynı istek 1 kez retry
        if (originalRequest._retry) {
            console.log('❌ Zaten retry edilmiş, logout');
            authLogout();
            return Promise.reject(error);
        }
        originalRequest._retry = true;

        console.log('🔁 401 hatası, refresh deneniyor...');

        // Refresh devam ediyorsa kuyruğa gir
        if (isRefreshing) {
            console.log('⏳ Refresh zaten devam ediyor, kuyruğa alınıyor');
            return new Promise((resolve, reject) => {
                refreshQueue.push({
                    resolve: (newToken) => {
                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        resolve(api(originalRequest));
                    },
                    reject,
                });
            });
        }

        isRefreshing = true;

        try {
            console.log('🔄 Refresh token isteği gönderiliyor');
            const newToken = await refreshAccessToken();
            console.log('✅ Yeni token alındı:', newToken.substring(0, 20) + '...');
            resolveQueue(null, newToken);

            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
        } catch (refreshErr) {
            console.error('❌ Refresh başarısız:', refreshErr);
            resolveQueue(refreshErr, null);
            authLogout();
            return Promise.reject(refreshErr);
        } finally {
            isRefreshing = false;
        }
    }
);