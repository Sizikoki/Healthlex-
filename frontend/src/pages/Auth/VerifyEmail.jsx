import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail, resendVerification } from "@/services/authService";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MailCheck, MailX } from "lucide-react";
import { toast } from "sonner";
import { usePageMeta } from "@/hooks/usePageMeta";

export const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [status, setStatus] = useState("loading");
    // loading | success | error

    usePageMeta({
        title: "Email Doğrulama | HealthLexMed",
        robots: "noindex,nofollow",
        canonicalPath: "/verify-email",
    });

    useEffect(() => {
        async function runVerify() {
            if (!token) {
                setStatus("error");
                return;
            }

            try {
                await verifyEmail(token);
                setStatus("success");
            } catch {
                setStatus("error");
            }
        }

        runVerify();
    }, [token]);

    const handleResend = async () => {
        const email = prompt("Doğrulama mailini tekrar göndermek için email gir:");
        if (!email) return;

        try {
            await resendVerification(email.trim());
            toast.success("Doğrulama maili tekrar gönderildi");
        } catch {
            toast.error("Mail gönderilemedi");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center gradient-hero px-4">
            <Card className="max-w-md w-full text-center shadow-xl">
                {status === "loading" && (
                    <CardHeader>
                        <CardTitle>Email doğrulanıyor…</CardTitle>
                        <CardDescription>Lütfen bekleyin</CardDescription>
                    </CardHeader>
                )}

                {status === "success" && (
                    <>
                        <CardHeader>
                            <MailCheck className="mx-auto w-12 h-12 text-primary" />
                            <CardTitle>Email Doğrulandı</CardTitle>
                            <CardDescription>
                                Hesabın başarıyla doğrulandı.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => navigate("/login")} className="w-full">
                                Giriş Yap
                            </Button>
                        </CardContent>
                    </>
                )}

                {status === "error" && (
                    <>
                        <CardHeader>
                            <MailX className="mx-auto w-12 h-12 text-destructive" />
                            <CardTitle>Doğrulama Başarısız</CardTitle>
                            <CardDescription>
                                Link geçersiz veya süresi dolmuş olabilir.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" onClick={handleResend} className="w-full">
                                Doğrulama Mailini Tekrar Gönder
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => navigate("/login")}
                                className="w-full"
                            >
                                Giriş Sayfasına Git
                            </Button>
                        </CardContent>
                    </>
                )}
            </Card>
        </div>
    );
};
