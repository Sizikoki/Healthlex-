// src/components/LogoutAllButton.js
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function LogoutAllButton() {
    const { logout } = useAuth();

    const handleLogoutAll = async () => {
        if (!window.confirm("Tüm cihazlardan çıkış yapılacak. Devam edilsin mi?")) {
            return;
        }

        try {
            await api.post("/auth/logout-all");
            toast.success("Tüm cihazlardan çıkış yapıldı");
            logout();
        } catch (error) {
            toast.error("Çıkış yapılamadı");
        }
    };

    return (
        <Button variant="outline" onClick={handleLogoutAll}>
            Tüm Cihazlardan Çıkış Yap
        </Button>
    );
}