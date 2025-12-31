import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Award, Flame, Calendar, Target, Trophy, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStats, getQuizScores, getMatchScores, getUser, getStreak } from '@/utils/storage';
import { getAllTerms } from '@/data/medicalTerms';

export const ProgressPage = () => {
  const stats = getStats();
  const user = getUser();
  const streak = getStreak();
  const quizScores = getQuizScores().slice(-10).reverse();
  const matchScores = getMatchScores().slice(-10).reverse();
  const totalTerms = getAllTerms().length;
  const progressPercentage = Math.round((stats.learnedTerms / totalTerms) * 100);

  const achievements = [
    {
      id: 1,
      title: 'İlk Adım',
      description: 'İlk terimi öğren',
      icon: Award,
      unlocked: stats.learnedTerms >= 1,
      color: 'primary'
    },
    {
      id: 2,
      title: 'Hızlı Başlangıç',
      description: '10 terim öğren',
      icon: Target,
      unlocked: stats.learnedTerms >= 10,
      color: 'secondary'
    },
    {
      id: 3,
      title: 'Quiz Ustadı',
      description: '5 quiz tamamla',
      icon: Trophy,
      unlocked: stats.quizzesTaken >= 5,
      color: 'accent'
    },
    {
      id: 4,
      title: 'Atefli',
      description: '7 günlük seri',
      icon: Flame,
      unlocked: streak.longestStreak >= 7,
      color: 'success'
    },
    {
      id: 5,
      title: 'Yıldız Öğrenci',
      description: '50 terim öğren',
      icon: Award,
      unlocked: stats.learnedTerms >= 50,
      color: 'primary'
    },
    {
      id: 6,
      title: 'Mükemmel',
      description: 'Quiz\'de %100 al',
      icon: Trophy,
      unlocked: quizScores.some(s => s.percentage === 100),
      color: 'success'
    }
  ];

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">İlerlemen</h1>
          <p className="text-lg text-muted-foreground">
            Merhaba {user?.name || 'Misafir'}, öğrenme yolculuğun burada!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-primary" />
                <div className="text-3xl font-bold text-primary">{stats.learnedTerms}</div>
              </div>
              <div className="text-sm font-medium">Öğrenilen Terim</div>
              <Progress value={progressPercentage} className="h-2 mt-2" />
              <div className="text-xs text-muted-foreground mt-1">{progressPercentage}% tamamlandı</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Flame className="w-8 h-8 text-secondary" />
                <div className="text-3xl font-bold text-secondary">{streak.currentStreak}</div>
              </div>
              <div className="text-sm font-medium">Günlük Seri</div>
              <div className="text-xs text-muted-foreground mt-2">En uzun: {streak.longestStreak} gün</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Trophy className="w-8 h-8 text-accent" />
                <div className="text-3xl font-bold text-accent">{stats.averageQuizScore}%</div>
              </div>
              <div className="text-sm font-medium">Ortalama Puan</div>
              <div className="text-xs text-muted-foreground mt-2">{stats.quizzesTaken} quiz</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 text-success" />
                <div className="text-3xl font-bold text-success">{streak.totalDays}</div>
              </div>
              <div className="text-sm font-medium">Toplam Gün</div>
              <div className="text-xs text-muted-foreground mt-2">{stats.totalReviews} gözden geçirme</div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-6 h-6" />
              Başarılar
            </CardTitle>
            <CardDescription>Kilidi açtığın ve henüz ulaşmadığın başarılar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                const colorClasses = {
                  primary: 'from-primary to-primary-dark',
                  secondary: 'from-secondary to-accent',
                  accent: 'from-accent to-success',
                  success: 'from-success to-secondary'
                };
                
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      achievement.unlocked
                        ? 'bg-card border-success shadow-lg'
                        : 'bg-muted/50 border-muted opacity-60'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[achievement.color]} flex items-center justify-center mb-3 ${
                      !achievement.unlocked && 'grayscale'
                    }`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="font-semibold mb-1">{achievement.title}</div>
                    <div className="text-sm text-muted-foreground">{achievement.description}</div>
                    {achievement.unlocked && (
                      <div className="mt-2 text-xs font-medium text-success">✓ Kilidi Açıldı</div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Activity History */}
        <Tabs defaultValue="quiz" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quiz">Quiz Geçmişi</TabsTrigger>
            <TabsTrigger value="match">Eşleştirme Geçmişi</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quiz">
            <Card>
              <CardHeader>
                <CardTitle>Son Quizler</CardTitle>
                <CardDescription>Son 10 quiz performansın</CardDescription>
              </CardHeader>
              <CardContent>
                {quizScores.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Henüz quiz tamamlamadın. 
                    <Link to="/games" className="text-primary hover:underline ml-1">Hemen başla!</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {quizScores.map((score, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                        <div>
                          <div className="font-medium">{score.score}/{score.total} doğru</div>
                          <div className="text-sm text-muted-foreground">{formatDate(score.date)}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            score.percentage >= 80 ? 'text-success' :
                            score.percentage >= 60 ? 'text-primary' :
                            'text-accent'
                          }`}>
                            {score.percentage}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="match">
            <Card>
              <CardHeader>
                <CardTitle>Son Eşleştirmeler</CardTitle>
                <CardDescription>Son 10 eşleştirme oyununun performansı</CardDescription>
              </CardHeader>
              <CardContent>
                {matchScores.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Henüz eşleştirme oyunu oynamadın. 
                    <Link to="/games" className="text-primary hover:underline ml-1">Hemen başla!</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {matchScores.map((score, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                        <div>
                          <div className="font-medium">{score.moves} hamle</div>
                          <div className="text-sm text-muted-foreground">{formatDate(score.date)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-secondary">{formatTime(score.time)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary via-secondary to-accent text-white">
          <CardContent className="p-8 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Yolculuğuna Devam Et!</h2>
            <p className="mb-6 opacity-90">
              {stats.learnedTerms < 20 ? 'Harika bir başlangıç yaptın!' :
               stats.learnedTerms < 50 ? 'Çok iyi ilerliyorsun!' :
               'Mükemmel bir performans! Devam et!'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="secondary" size="lg">
                <Link to="/study">
                  Çalışmaya Devam Et
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 border-white/20 hover:bg-white/20">
                <Link to="/games">
                  Oyunlara Geç
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};