import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import * as authService from "@/services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [checking, setChecking] = useState(true);

    // =====================
    // APP BOOTSTRAP
    // =====================
    // App açıldığında:
    // - access token varsa axios interceptor otomatik ekler
    // - /me çağrılır
    // - token expired ise refresh otomatik yapılır
    useEffect(() => {
        let mounted = true;

        async function init() {
            try {
                const me = await authService.me();
                if (mounted) setUser(me);
            } catch (e) {
                // access + refresh geçersiz → guest moda düş
                await authService.logout();
                if (mounted) setUser(null);
            } finally {
                if (mounted) setChecking(false);
            }
        }

        init();
        return () => {
            mounted = false;
        };
    }, []);

    // =====================
    // LOGIN
    // =====================
    async function login({ email, password }) {
        setChecking(true);
        try {
            // authService login:
            // - access + refresh token kaydeder
            await authService.login({ email, password });

            // gerçek kullanıcıyı çek
            const me = await authService.me();
            setUser(me);
            return me;
        } catch (e) {
            await authService.logout();
            setUser(null);
            throw e;
        } finally {
            setChecking(false);
        }
    }

    // =====================
    // REGISTER
    // =====================
    async function register(payload) {
        setChecking(true);
        try {
            // register → token pair döner ve storage’a kaydedilir
            await authService.register(payload);

            const me = await authService.me();
            setUser(me);
            return me;
        } catch (e) {
            await authService.logout();
            setUser(null);
            throw e;
        } finally {
            setChecking(false);
        }
    }

    // =====================
    // LOGOUT
    // =====================
    async function logout() {
        await authService.logout();
        setUser(null);
    }

    // =====================
    // CONTEXT VALUE
    // =====================
    const value = useMemo(
        () => ({
            user,
            checking,
            isAuthenticated: !!user,
            login,
            register,
            logout,
        }),
        [user, checking]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth() AuthProvider içinde kullanılmalı");
    }
    return ctx;
}
