import { api } from "@/api/client";

export async function register(payload) {
    const res = await api.post("/api/auth/register", payload);
    return res.data;
}

export async function login(payload) {
    const res = await api.post("/api/auth/login", payload);
    return res.data;
}

// ✅ YENİ: Google Login Fonksiyonu
// Artık Login.jsx içinde axios.post yerine bunu çağırabilirsin.
export async function loginWithGoogle(credential) {
    const res = await api.post("/api/auth/google", { credential });
    return res.data;
}

export async function me() {
    const res = await api.get("/api/auth/me");
    return res.data;
}

export async function logout(refresh_token) {
    const res = await api.post("/api/auth/logout", { refresh_token });
    return res.data;
}

// ✅ BUILD FIX: verifyEmail (Hata veren eksik fonksiyon buydu)
export async function verifyEmail(token) {
    // Backend'de bu endpoint henüz yoksa bile fonksiyon burada tanımlı olmalı ki build geçsin
    const res = await api.post("/api/auth/verify-email", { token });
    return res.data;
}

// ✅ Build fix: resendVerification
export async function resendVerification(email) {
    // Backend'e e-posta parametresiyle gönderiyoruz
    const res = await api.post("/api/auth/resend-verification", { email });
    return res.data;
}