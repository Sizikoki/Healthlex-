import { api } from "@/api/client";

export async function register(payload) {
    const res = await api.post("/api/auth/register", payload);
    return res.data;
}

export async function login(payload) {
    const res = await api.post("/api/auth/login", payload);
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

// ✅ Build fix: resendVerification (doğrulama mailini yeniden gönder) — şimdilik backend’de yoksa stub
export async function resendVerification() {
    // Eğer ileride backend'e endpoint eklersen burada gerçek çağrıyı yaparsın:
    // return (await api.post("/api/auth/resend-verification")).data;

    // Şimdilik build kırılmasın diye kontrollü hata:
    throw new Error("resendVerification backend endpoint'i henüz yok");
}
