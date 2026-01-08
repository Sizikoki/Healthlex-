import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Award, LogOut, TrendingUp, Shield, Lock, Bell, Monitor, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { getUser, getStats, logout } from '@/utils/storage';
import { toast } from 'sonner';

export const Profile = () => {
  const navigate = useNavigate();
  const user = getUser();
  const stats = getStats();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showLogoutAllDialog, setShowLogoutAllDialog] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Çıkış yapıldı');
    navigate('/login');
  };

  const handleLogoutAllDevices = () => {
    setShowLogoutAllDialog(false);
    // Simulate logout from all devices
    logout();
    toast.success('Tüm cihazlardan çıkış yapıldı');
    navigate('/login');
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold mb-2">{user?.name || 'Kullanıcı'}</h1>
                <div className="flex flex-col sm:flex-row gap-4 text-muted-foreground">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Üyelik: {formatDate(user?.joinDate)}</span>
                  </div>
                </div>
              </div>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış Yap
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Navigation */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="security">Güvenlik</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-8">
            {/* Stats Overview */}
            <div className="grid sm:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Öğrenme İstatistikleri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Öğrenilen Terim</span>
                    <span className="text-2xl font-bold text-primary">{stats.learnedTerms}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Toplam Gözden Geçirme</span>
                    <span className="text-2xl font-bold text-secondary">{stats.totalReviews}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Günlük Seri</span>
                    <span className="text-2xl font-bold text-accent">{stats.currentStreak}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-success" />
                    Oyun Performansı
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Ortalama Quiz Puanı</span>
                    <span className="text-2xl font-bold text-success">{stats.averageQuizScore}%</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tamamlanan Quiz</span>
                    <span className="text-2xl font-bold text-primary">{stats.quizzesTaken}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Eşleştirme Oyunları</span>
                    <span className="text-2xl font-bold text-secondary">{stats.matchGamesPlayed}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Achievements Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Başarılar</CardTitle>
                <CardDescription>Kilidi açılan ödülleriniz</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {stats.learnedTerms >= 1 && (
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <div className="text-3xl mb-2">🎖️</div>
                      <div className="text-xs font-medium">İlk Adım</div>
                    </div>
                  )}
                  {stats.learnedTerms >= 10 && (
                    <div className="text-center p-4 bg-secondary/10 rounded-lg">
                      <div className="text-3xl mb-2">🎯</div>
                      <div className="text-xs font-medium">Hızlı Başlangıç</div>
                    </div>
                  )}
                  {stats.quizzesTaken >= 5 && (
                    <div className="text-center p-4 bg-accent/10 rounded-lg">
                      <div className="text-3xl mb-2">🏆</div>
                      <div className="text-xs font-medium">Quiz Ustası</div>
                    </div>
                  )}
                  {stats.currentStreak >= 7 && (
                    <div className="text-center p-4 bg-success/10 rounded-lg">
                      <div className="text-3xl mb-2">🔥</div>
                      <div className="text-xs font-medium">Ateşli</div>
                    </div>
                  )}
                </div>
                {stats.learnedTerms < 1 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Henüz bir başarı kazanmadın. Öğrenmeye başla!
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => navigate('/study')} className="flex-1 gradient-primary">
                Çalışmaya Devam Et
              </Button>
              <Button onClick={() => navigate('/progress')} variant="outline" className="flex-1">
                İlerlemeni Gör
              </Button>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            {/* Active Sessions Card */}
            <Card className="border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <Monitor className="w-5 h-5" />
                  Aktif Oturumlar
                </CardTitle>
                <CardDescription>
                  Hesabınıza bağlı cihazları yönetin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {/* Current Session */}
                  <div className="flex items-start justify-between p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                        <Monitor className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Bu Cihaz (Aktif)</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Windows • Chrome • İstanbul, Türkiye
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Son Aktivite: Şimdi
                        </div>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full font-medium">
                      Aktif
                    </div>
                  </div>

                  {/* Other Sessions */}
                  <div className="flex items-start justify-between p-4 bg-white/40 dark:bg-gray-800/40 rounded-lg border border-amber-100 dark:border-amber-900">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">iPhone 14</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          iOS • Safari • İstanbul, Türkiye
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Son Aktivite: 2 saat önce
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-amber-200 dark:bg-amber-800" />

                <div className="flex items-start gap-3 p-3 bg-amber-100/50 dark:bg-amber-900/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800 dark:text-amber-200">
                    <p className="font-medium mb-1">Güvenlik Uyarısı</p>
                    <p className="text-xs">
                      Tanımadığınız bir cihaz görüyorsanız, hemen tüm cihazlardan çıkış yapın ve parolanızı değiştirin.
                    </p>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setShowLogoutAllDialog(true)}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Tüm Cihazlardan Çıkış Yap
                </Button>
              </CardContent>
            </Card>

            {/* Change Password Card (Disabled) */}
            <Card className="opacity-60 cursor-not-allowed bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-muted-foreground">
                  <Lock className="w-5 h-5" />
                  Parola Değiştir
                </CardTitle>
                <CardDescription>
                  Hesap güvenliğinizi artırmak için parolanızı güncelleyin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Mevcut Parola</label>
                    <div className="h-10 bg-muted rounded-md border border-input" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Yeni Parola</label>
                    <div className="h-10 bg-muted rounded-md border border-input" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Yeni Parola (Tekrar)</label>
                    <div className="h-10 bg-muted rounded-md border border-input" />
                  </div>
                </div>
                <Button disabled className="w-full">
                  Parolayı Güncelle
                </Button>
                <div className="text-xs text-center text-muted-foreground">
                  Bu özellik yakında aktif olacak
                </div>
              </CardContent>
            </Card>

            {/* Email Notifications Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  E-posta Bildirimleri
                </CardTitle>
                <CardDescription>
                  Hangi bildirimleri almak istediğinizi seçin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <Checkbox
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="email-notifications"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Öğrenme Hatırlatıcıları
                      </label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Günlük çalışma hatırlatıcıları ve ilerleme raporları alın
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <Checkbox
                      id="achievement-notifications"
                      defaultChecked
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="achievement-notifications"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Başarı Bildirimleri
                      </label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Yeni başarılar kazandığınızda bildirim alın
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <Checkbox
                      id="security-notifications"
                      defaultChecked
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="security-notifications"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Güvenlik Bildirimleri
                      </label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Hesap güvenliğiyle ilgili önemli bildirimleri alın (Önerilen)
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <Button className="w-full gradient-primary">
                  <Shield className="w-4 h-4 mr-2" />
                  Tercihleri Kaydet
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Logout All Devices Confirmation Dialog */}
        <AlertDialog open={showLogoutAllDialog} onOpenChange={setShowLogoutAllDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Tüm Cihazlardan Çıkış Yap
              </AlertDialogTitle>
              <AlertDialogDescription>
                Bu işlem, hesabınıza bağlı tüm cihazlardan çıkış yapacaktır. Devam etmek için tekrar giriş yapmanız gerekecek.
                <br /><br />
                Bu işlemi gerçekleştirmek istediğinizden emin misiniz?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogoutAllDevices}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Evet, Çıkış Yap
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};