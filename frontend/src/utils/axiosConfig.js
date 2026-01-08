console.log('🔧 axiosConfig.js yüklendi! API interceptor aktif.');
// src/utils/axiosConfig.js
import axios from 'axios';

// Axios instance oluştur
const api = axios.create({
    baseURL: '/api',
});

// Refresh işlemi için singleton değişkenler
let refreshPromise = null;
let isRefreshing = false;

// Request interceptor - her istekte token ekle
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - 401 hatasında refresh dene
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Eğer 401 hatası ve henüz retry edilmediyse
        if (error.response?.status === 401 && !originalRequest._retry) {

            // Eğer zaten refresh yapılıyorsa, o promise'i bekle
            if (isRefreshing) {
                console.log('⏳ Zaten refresh yapılıyor, bekleniyor...');
                try {
                    await refreshPromise;
                    // Refresh tamamlandı, orijinal isteği yeni token ile tekrarla
                    const newToken = localStorage.getItem('access_token');
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    originalRequest._retry = true; // Tekrar deneme yapıldı olarak işaretle
                    return api(originalRequest);
                } catch (refreshError) {
                    return Promise.reject(refreshError);
                }
            }

            // İlk 401 hatası, refresh başlat
            isRefreshing = true;
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refresh_token');
            console.log('🔁 Refresh token var mı?', !!refreshToken);

            if (!refreshToken) {
                console.log('❌ Refresh token yok, logout yapılıyor');
                localStorage.clear();
                window.location.href = '/login';
                isRefreshing = false;
                return Promise.reject(error);
            }

            try {
                console.log('🔄 Refresh isteği gönderiliyor...');

                // Singleton refresh promise oluştur
                refreshPromise = axios.post('/api/auth/refresh', {}, {
                    headers: {
                        'Authorization': `Bearer ${refreshToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                const response = await refreshPromise;
                console.log('✅ Refresh başarılı!');
                const { access_token, refresh_token: newRefreshToken } = response.data;

                // DEBUG için
                console.log('Yeni access token (ilk 30):', access_token.substring(0, 30) + '...');
                console.log('Yeni refresh token (ilk 12):', newRefreshToken.substring(0, 12) + '...');

                // Yeni token'ları kaydet (BU ÇOK ÖNEMLİ!)
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', newRefreshToken);

                console.log('💾 Tokenlar kaydedildi');

                // Tüm bekleyen istekleri yeni token ile güncelle
                // (Bu kısım diğer paralel istekler için)

                // Orijinal isteği yeni token ile tekrarla
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return api(originalRequest);

            } catch (refreshError) {
                console.error('❌ Refresh başarısız:', refreshError.response?.data || refreshError.message);
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                // İşlem bitti, flag'leri sıfırla
                isRefreshing = false;
                refreshPromise = null;
            }
        }

        return Promise.reject(error);
    }
);

export default api;