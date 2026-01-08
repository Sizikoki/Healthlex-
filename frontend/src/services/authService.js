import { api } from "@/api/client";
import { setTokens, getRefreshToken, authLogout } from "@/utils/storage";

export async function register(payload) {
    const res = await api.post("/api/auth/register", payload);
    return res.data;
}

export async function login(payload) {
    const res = await api.post("/api/auth/login", payload);

    // backend token döndürüyorsa kaydet
    if (res?.data?.access_token || res?.data?.refresh_token) {
        setTokens({
            access_token: res.data.access_token,
            refresh_token: res.data.refresh_token,
        });
    }

    return res.data;
}

export async function loginWithGoogle(credential) {
    const res = await api.post("/api/auth/google", { credential });

    // ✅ google tokenları burada kaydet
    setTokens({
        access_token: res.data.access_token,
        refresh_token: res.data.refresh_token,
    });

    return res.data;
}

export async function me() {
    const res = await api.get("/api/auth/me");
    return res.data;
}

// ✅ Logout her zaman local temizler (backend patlasa bile)
export async function logout() {
    const refresh_token = getRefreshToken();

    try {
        await api.post("/api/auth/logout", { refresh_token });
    } catch (e) {
        // ignore
    } finally {
        authLogout(); // access_token + refresh_token + auth_user temizler
    }

    return true;
}

export async function verifyEmail(token) {
    const res = await api.post("/api/auth/verify-email", { token });
    return res.data;
}

export async function resendVerification(email) {
    const res = await api.post("/api/auth/resend-verification", { email });
    return res.data;
}
