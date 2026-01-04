import api from "@/api/client";

/**
 * REGISTER
 * - Backend token DÖNDÜRMEZ
 * - Sadece "mail gönderildi" akışı
 */
export async function register(payload) {
    const res = await api.post("/auth/register", payload);
    return res.data;
}

/**
 * LOGIN
 * - Email doğrulanmamışsa 403 döner
 */
export async function login(payload) {
    try {
        const res = await api.post("/auth/login", payload);
        return res.data;
    } catch (err) {
        if (err.response?.status === 403) {
            // Email doğrulanmadı
            throw {
                code: "EMAIL_NOT_VERIFIED",
                message: "Email doğrulanmadı",
            };
        }
        throw err;
    }
}

/**
 * CURRENT USER
 */
export async function me() {
    const res = await api.get("/auth/me");
    return res.data;
}

/**
 * EMAIL VERIFY
 */
export async function verifyEmail(token) {
    const res = await api.post("/auth/verify-email", { token });
    return res.data;
}

/**
 * RESEND VERIFY EMAIL
 */
export async function resendVerification(email) {
    const res = await api.post("/auth/resend-verification", { email });
    return res.data;
}

/**
 * LOGOUT
 * - refresh token backend’de iptal edilir
 */
export async function logout() {
    try {
        await api.post("/auth/logout");
    } catch (_) {
        // backend unreachable olsa bile logout devam eder
    }
}
