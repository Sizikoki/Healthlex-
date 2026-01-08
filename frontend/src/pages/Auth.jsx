import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Activity, Mail, Lock, User as UserIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

// Google button
import { GoogleLogin } from "@react-oauth/google";
import { resendVerification } from "@/services/authService";

/* =========================
    LOGIN
========================= */

export const Login = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [needVerify, setNeedVerify] = useState(false);

  usePageMeta({
    title: "Giriş Yap | HealthLexMed",
    robots: "noindex,nofollow",
    canonicalPath: "/login",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setNeedVerify(false);

    if (!email || !password) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      toast.success("Giriş başarılı!");
      navigate("/profile");
    } catch (err) {
      if (err?.code === "EMAIL_NOT_VERIFIED") {
        setNeedVerify(true);
        toast.error("Email doğrulanmamış");
      } else {
        toast.error("E-posta veya şifre hatalı");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google login: token/me/state işini AuthContext halleder
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      await googleLogin(credentialResponse.credential);
      toast.success("Google ile giriş başarılı!");
      navigate("/profile");
    } catch (err) {
      console.error("Google login failed:", err);
      toast.error("Google girişi başarısız oldu.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendVerification(email.trim());
      toast.success("Doğrulama maili tekrar gönderildi");
    } catch {
      toast.error("Mail gönderilemedi");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-xl shadow-lg">
              <Activity className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Giriş Yap</CardTitle>
          <CardDescription>Hesabına eriş</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label>E-posta</Label>
              <Input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Şifre</Label>
              <Input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary"
              disabled={loading}
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>

          {/* Google ayırıcı */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground font-medium">
                Veya
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google girişi başarısız")}
              theme="outline"
              size="large"
              width="100%"
              shape="pill"
            />
          </div>

          {needVerify && (
            <div className="mt-4 text-center space-y-2">
              <p className="text-sm text-destructive">Email doğrulanmamış.</p>
              <Button variant="outline" onClick={handleResend}>
                Doğrulama Mailini Tekrar Gönder
              </Button>
            </div>
          )}

          <p className="mt-6 text-center text-sm">
            Hesabın yok mu?{" "}
            <Link to="/register" className="text-primary underline font-medium">
              Kayıt Ol
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

/* =========================
    REGISTER
========================= */

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  usePageMeta({
    title: "Kayıt Ol | HealthLexMed",
    robots: "noindex,nofollow",
    canonicalPath: "/register",
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Tüm alanları doldurun");
      return;
    }

    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      setRegistered(true);
      toast.success("Doğrulama maili gönderildi");
    } catch {
      toast.error("Kayıt başarısız");
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-hero px-4">
        <Card className="max-w-md text-center">
          <CardHeader>
            <Sparkles className="mx-auto w-10 h-10 text-primary" />
            <CardTitle>Email Doğrulama</CardTitle>
            <CardDescription>
              Mail adresine doğrulama linki gönderdik.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/login")}>
              Giriş Sayfasına Git
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <UserIcon className="mx-auto w-8 h-8 text-primary" />
          <CardTitle>Kayıt Ol</CardTitle>
          <CardDescription>Ücretsiz hesap oluştur</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              placeholder="Ad Soyad"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Şifre"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              className="w-full gradient-primary"
              disabled={loading}
            >
              {loading ? "Oluşturuluyor..." : "Hesap Oluştur"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm">
            Zaten hesabın var mı?{" "}
            <Link to="/login" className="text-primary underline font-medium">
              Giriş Yap
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
