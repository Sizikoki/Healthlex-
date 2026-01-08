import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "@/services/authService";
import { getAccessToken, getRefreshToken } from "@/utils/storage";
import api from "@/utils/axiosConfig"; // YENİ: axios instance import

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [checking, setChecking] = useState(true);

    // App açılışında: token varsa me çek
    useEffect(() => {
        let mounted = true;

        async function init() {
            setChecking(true);
            try {
                const token = getAccessToken();
                if (!token) {
                    if (mounted) setUser(null);
                    return;
                }

                // API instance ile me çağrısı (interceptor çalışsın)
                const me = await api.get('/auth/me');
                if (mounted) setUser(me.data);
            } catch (e) {
                console.error('App init error:', e);
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

    async function login({ email, password }) {
        setChecking(true);
        try {
            // 1. Login yap ve token'ları al
            const tokens = await authService.login({ email, password });

            // 2. Token'ları localStorage'a kaydet (authService zaten yapıyor ama kontrol)
            console.log('Login başarılı, tokenlar:', tokens);

            // 3. API instance ile me çağrısı
            const meResponse = await api.get('/auth/me');
            const me = meResponse.data;

            setUser(me);
            return me;
        } catch (e) {
            console.error('Login error:', e);
            await authService.logout();
            setUser(null);
            throw e;
        } finally {
            setChecking(false);
        }
    }

    async function googleLogin(credential) {
        setChecking(true);
        try {
            // 1. Google login yap ve token'ları al
            const tokens = await authService.loginWithGoogle(credential);
            console.log('Google login başarılı, tokenlar:', tokens);

            // 2. API instance ile me çağrısı
            const meResponse = await api.get('/auth/me');
            const me = meResponse.data;

            setUser(me);
            return me;
        } catch (e) {
            console.error('Google login error:', e);
            await authService.logout();
            setUser(null);
            throw e;
        } finally {
            setChecking(false);
        }
    }

    async function register(payload) {
        setChecking(true);
        try {
            await authService.register(payload);
            // Register token döndürmüyor → kullanıcı login olmalı
            setUser(null);
            return null;
        } catch (e) {
            console.error('Register error:', e);
            await authService.logout();
            setUser(null);
            throw e;
        } finally {
            setChecking(false);
        }
    }

    async function logout() {
        try {
            // Refresh token ile backend'den logout yap
            const refreshToken = getRefreshToken();
            if (refreshToken) {
                await authService.logout(refreshToken);
            }
        } catch (e) {
            console.warn('Logout error:', e);
        } finally {
            // Her durumda local temizle
            await authService.logout(); // local temizler
            setUser(null);
        }
    }

    const value = useMemo(
        () => ({
            user,
            checking,
            isAuthenticated: !!user,
            login,
            googleLogin,
            register,
            logout,
        }),
        [user, checking]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth() AuthProvider içinde kullanılmalı");
    return ctx;
}