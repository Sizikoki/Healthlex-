import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, checking } = useAuth();

    // App açılırken /me kontrolü sürüyorsa BEKLE
    if (checking) {
        return null; // istersen loader koyarsın
    }

    // Giriş yoksa login'e at
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Giriş varsa içeriği göster
    return children;
}
