import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Trophy, BookOpen, Gamepad2, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { categories } from '@/data/medicalTerms';
import { isLoggedIn, getStats } from '@/utils/storage';

export const Home = () => {
  const loggedIn = isLoggedIn();
  const stats = loggedIn ? getStats() : null;

  const features = [
    {
      icon: BookOpen,
      title: 'Kapsamlı Kelime Havuzu',
      description: 'Tıbbi terminoloji kökleri, anatomik terimler, ameliyat terimleri ve patolojiler',
      color: 'primary'
    },
    {
      icon: Gamepad2,
      title: 'Eğlenceli Oyunlar',
      description: 'Flashcard, eşleştirme ve quiz oyunları ile eğlenerek öğren',
      color: 'secondary'
    },
    {
      icon: TrendingUp,
      title: 'İlerleme Takibi',
      description: 'Öğrenme sürecini takip et, günlük seriler oluştur, başarılarını gör',
      color: 'accent'
    },
    {
      icon: Sparkles,
      title: 'Kök ve Ek Analizi',
      description: 'Kelimelerin köklerini ve eklerini öğren, yeni kelimeleri kolaylıkla çöz',
      color: 'success'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Sağlıkçılar için özel olarak tasarlandı</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
              Tıbbi Terminolojiyi
              <span className="block mt-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Eğlenerek Öğren
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground">
              Tıp, hemşirelik ve diğer sağlık bilimleri öğrencileri için interaktif tıbbi terim öğrenme platformu
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {loggedIn ? (
                <Button asChild size="lg" className="gradient-primary text-lg px-8 shadow-lg hover:shadow-glow transition-all">
                  <Link to="/study">
                    Çalışmaya Başla
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="gradient-primary text-lg px-8 shadow-lg hover:shadow-glow transition-all">
                    <Link to="/register">
                      Ücretsiz Başla
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="text-lg px-8">
                    <Link to="/login">Giriş Yap</Link>
                  </Button>
                </>
              )}
            </div>

            {loggedIn && stats && (
              <div className="flex flex-wrap items-center justify-center gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{stats.learnedTerms}</div>
                  <div className="text-sm text-muted-foreground">Öğrenilen Terim</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">{stats.currentStreak}</div>
                  <div className="text-sm text-muted-foreground">Günlük Seri</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">{stats.averageQuizScore}%</div>
                  <div className="text-sm text-muted-foreground">Ortalama Puan</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Neden HealthLex?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tıbbi terminoloji öğrenmeyi kolay ve eğlenceli hale getiren özellikler
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-lg bg-${feature.color}/10 flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 text-${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Kategori Seç</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Öğrenmek istediğin kategoriden başla
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const colorClasses = {
                primary: 'from-primary to-primary-dark',
                secondary: 'from-secondary to-secondary-dark',
                accent: 'from-accent to-success',
                success: 'from-success to-accent'
              };
              
              return (
                <Link key={category.id} to={`/study?category=${category.id}`}>
                  <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${colorClasses[category.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <div className="text-3xl text-white">🫀</div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{category.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>Başla</span>
                      <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!loggedIn && (
        <section className="py-16 bg-gradient-to-r from-primary via-secondary to-accent">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Trophy className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Şimdi Başla, Başarıya Ulaş!
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Binlerce sağlık profesyoneli tıbbi terminolojiyi HealthLex ile öğreniyor
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 shadow-xl">
                <Link to="/register">
                  Ücretsiz Hesap Oluştur
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-16 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">1000+</div>
              <div className="text-lg text-muted-foreground">Tıbbi Terim</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-secondary mb-2">50+</div>
              <div className="text-lg text-muted-foreground">Kök ve Ek</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-accent mb-2">3</div>
              <div className="text-lg text-muted-foreground">Oyun Modu</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};