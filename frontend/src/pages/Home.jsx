import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Trophy, BookOpen, Gamepad2, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { categories } from "@/data/medicalTerms";

export const Home = () => {
  const { isAuthenticated, checking, user } = useAuth();

  if (checking) return null;

  // Tailwind dynamic class sorununu çözmek için sabit map
  const featureStyles = {
    primary: { box: "bg-primary/10", icon: "text-primary" },
    secondary: { box: "bg-secondary/10", icon: "text-secondary" },
    accent: { box: "bg-accent/10", icon: "text-accent" },
    success: { box: "bg-success/10", icon: "text-success" },
  };

  const features = [
    {
      icon: BookOpen,
      title: "Kapsamlı Kelime Havuzu",
      description: "Tıbbi terminoloji kökleri, anatomik terimler, ameliyat terimleri ve patolojiler",
      color: "primary",
    },
    {
      icon: Gamepad2,
      title: "Eğlenceli Oyunlar",
      description: "Flashcard, eşleştirme ve quiz oyunları ile eğlenerek öğren",
      color: "secondary",
    },
    {
      icon: TrendingUp,
      title: "İlerleme Takibi",
      description: "Öğrenme sürecini takip et, günlük seriler oluştur, başarılarını gör",
      color: "accent",
    },
    {
      icon: Sparkles,
      title: "Kök ve Ek Analizi",
      description: "Kelimelerin köklerini ve eklerini öğren, yeni kelimeleri kolaylıkla çöz",
      color: "success",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Sağlıkçılar için özel olarak tasarlandı
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            Tıbbi Terminolojiyi
            <span className="block mt-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Eğlenerek Öğren
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Tıp, hemşirelik ve diğer sağlık bilimleri öğrencileri için interaktif öğrenme platformu
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {isAuthenticated ? (
              <Button asChild size="lg" className="gradient-primary px-8">
                <Link to="/study">
                  Çalışmaya Başla <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="gradient-primary px-8">
                  <Link to="/register">
                    Ücretsiz Başla <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/login">Giriş Yap</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              const s = featureStyles[f.color];
              return (
                <Card key={i} className="p-6 hover:shadow-lg transition">
                  <div className={`w-12 h-12 rounded-lg ${s.box} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${s.icon}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground">{f.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c) => (
            <Link key={c.id} to={`/study?category=${c.id}`}>
              <Card className="p-6 hover:shadow-xl hover:-translate-y-2 transition cursor-pointer">
                <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center mb-4 text-white text-3xl">
                  🫀
                </div>
                <h3 className="text-xl font-semibold">{c.name}</h3>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {!isAuthenticated && (
        <section className="py-16 bg-gradient-to-r from-primary via-secondary to-accent text-center text-white">
          <Trophy className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Şimdi Başla</h2>
          <Button asChild size="lg" variant="secondary">
            <Link to="/register">
              Ücretsiz Hesap Oluştur <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </section>
      )}
    </div>
  );
};
